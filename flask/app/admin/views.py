import os
import json
import math
import uuid
from hashids import Hashids
from time import time
from flask import render_template, url_for, flash, redirect, request, Blueprint, jsonify
from flask_login import current_user, logout_user, login_required
from app import app, db, basedir
from PIL import Image, ImageSequence
from sqlalchemy import func
from app.models import Event, EventsSlot, Lecture, Step, Answer, User, Course
from datetime import datetime
from dateutil import tz
from pytz import timezone
from functools import wraps
from datetime import datetime
from flask import make_response
from cryptography.fernet import Fernet

cipher_suite = Fernet(b"CLbOShYydTCn6udFzYOXj5C4OqrQ8Rz15hTtL4sSLDI=")
hasher = Hashids("7qsnqSGiOlZdQOUQzXrM")

admin = Blueprint("admin", __name__)


def maybe_int(value):
    try:
        return int(value)
    except:
        return value


def localize_datetime(datetime2fix):
    try:
        return datetime2fix.astimezone(timezone("Europe/Prague"))
    except:
        return datetime2fix


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].upper() in [
        "JPEG",
        "JPG",
        "PNG",
        "GIF",
    ]


def fix_text(text2fix):
    if text2fix == "EXTERNAL: EXTERNAL_reminder":
        return "[external]"
    return text2fix


def get_course_data(_course, rewrite_lectures=False):
    data = {"lectures": []}

    data["export_type"] = "course"
    data["name"] = _course.name
    data["description"] = _course.description

    data2rewrite = {}
    for _lecture in (
        Lecture.query.filter_by(course_id=_course.id).order_by(Lecture.position).all()
    ):
        data2rewrite[_lecture.id] = str(uuid.uuid4())

    for _lecture in (
        Lecture.query.filter_by(course_id=_course.id).order_by(Lecture.position).all()
    ):
        lecture = get_lecture_data(
            _lecture, data2rewrite=data2rewrite, rewrite_lectures=rewrite_lectures
        )
        lecture["uuid4"] = data2rewrite[_lecture.id]
        data["lectures"].append(lecture)

    return data


def import_course_from_data(course_data):
    course = Course()
    course.name = course_data.get("name", "")
    course.description = course_data.get("description", "")
    course.company_id = course_data.get("company_id", 0)

    db.session.add(course)
    db.session.commit()
    db.session.refresh(course)

    lectures2new = {}
    answers2change = {}
    for lecture_data in course_data["lectures"]:
        lecture, _answers2change = create_lecture_from_data(
            lecture_data, rewrite_lecture=True
        )
        lecture.course_id = course.id
        db.session.add(lecture)
        db.session.commit()
        db.session.refresh(lecture)
        lectures2new[lecture_data["uuid4"]] = lecture.id
        answers2change |= _answers2change

    # fixing wrong path - lections
    for answer in (
        Answer.query.filter(Answer.id.in_(answers2change.keys()))
        .filter_by(parent_id=0)
        .filter_by(following_action="lecture")
    ):
        # lecture uuid
        lecture_uuid = answers2change[answer.id]
        # getting new lecture id from uuid
        answer.following_action_id = lectures2new.get(lecture_uuid)
        db.session.add(answer)
        db.session.commit()

    return course


def get_lecture_data(_lecture, data2rewrite=None, rewrite_lectures=False):
    if data2rewrite is None:
        data2rewrite = {}

    old2new = {}
    data = {"steps": []}

    data["name"] = _lecture.name
    data["description"] = _lecture.description
    if not rewrite_lectures:
        data["course_id"] = _lecture.course_id
    data["export_type"] = "lecture"

    for _step in (
        Step.query.filter_by(lecture_id=_lecture.id)
        .filter_by(parent_id=0)
        .order_by(Step.position)
        .all()
    ):
        step2append = {}
        step2append["uuid4"] = str(uuid.uuid4())
        step2append["step_type"] = _step.step_type
        step2append["response_type"] = _step.response_type
        step2append["position"] = _step.position
        step2append["description"] = _step.description or ""
        step2append["free_input"] = _step.free_input or False
        step2append["text"] = _step.text or ""
        step2append["text2"] = _step.text2 or ""
        step2append["text3"] = _step.text3 or ""
        step2append["answers"] = []
        step2append["substeps"] = []
        old2new[_step.id] = step2append["uuid4"]

        if _step.response_type == "question":
            for _answer in (
                Answer.query.filter_by(step_id=_step.id)
                .filter_by(parent_id=0)
                .order_by(Answer.position)
                .all()
            ):
                answer2append = {}
                answer2append["text2match"] = _answer.text2match
                answer2append["description"] = _answer.description
                answer2append["answer_type"] = _answer.answer_type
                answer2append["position"] = _answer.position
                answer2append["text"] = _answer.text
                answer2append["text2"] = _answer.text2
                answer2append["correct_answer"] = _answer.correct_answer or False
                answer2append["following_action"] = _answer.following_action
                if rewrite_lectures and answer2append["following_action"] == "lecture":
                    if (
                        data2rewrite
                        and maybe_int(_answer.following_action_id) in data2rewrite
                    ):
                        answer2append["following_action_id"] = data2rewrite[
                            maybe_int(_answer.following_action_id)
                        ]
                    else:
                        # getting lectures is it really needed? maybe not...
                        ...
                else:
                    answer2append["following_action_id"] = maybe_int(
                        _answer.following_action_id
                    )

                answer2append["subanswers"] = []

                child_answers = (
                    Answer.query.filter_by(step_id=_step.id)
                    .filter_by(parent_id=_answer.id)
                    .order_by(Answer.position)
                    .all()
                )
                for child_answer in child_answers:
                    subanswer2append = {}
                    subanswer2append["text2match"] = child_answer.text2match
                    subanswer2append["description"] = child_answer.description
                    subanswer2append["answer_type"] = child_answer.answer_type
                    subanswer2append["text"] = child_answer.text
                    subanswer2append["text2"] = child_answer.text2
                    subanswer2append["correct_answer"] = child_answer.correct_answer
                    subanswer2append["position"] = child_answer.position
                    answer2append["subanswers"].append(subanswer2append)

                step2append["answers"].append(answer2append)
        else:
            child_steps = (
                Step.query.filter_by(lecture_id=_lecture.id)
                .filter_by(parent_id=_step.id)
                .order_by(Step.position)
                .all()
            )
            for child_step in child_steps:
                substep2append = {}
                substep2append["step_type"] = child_step.step_type
                substep2append["response_type"] = child_step.response_type
                substep2append["description"] = child_step.description or ""
                substep2append["text"] = child_step.text or ""
                substep2append["position"] = child_step.position
                substep2append["text2"] = child_step.text2 or ""
                substep2append["text3"] = child_step.text3 or ""
                step2append["substeps"].append(substep2append)

        data["steps"].append(step2append)

    for step_index, _step2fix in enumerate(data["steps"]):
        if _step2fix["response_type"] == "question":
            for answer_index, _answer2fix in enumerate(_step2fix["answers"]):
                if _answer2fix["following_action"] == "step":
                    data["steps"][step_index]["answers"][answer_index][
                        "following_action_id"
                    ] = old2new.get(
                        maybe_int(_answer2fix.get("following_action_id", 0)), 0
                    )
    return data


def create_lecture_from_data(lecture_data, rewrite_lecture=False):
    lecture = Lecture()
    lecture.name = lecture_data["name"]
    lecture.description = lecture_data["description"]
    lecture.course_id = lecture_data.get("course_id")
    lecture.last_edited = datetime.now(tz.gettz("Europe/Prague"))

    db.session.add(lecture)
    db.session.commit()
    db.session.refresh(lecture)

    old2new = {}
    steps_uuid = {}
    answers2change = {}

    for step_data in lecture_data["steps"]:
        _step = Step()
        _step.step_type = step_data["step_type"]
        _step.response_type = step_data["response_type"]
        _step.parent_id = 0
        _step.position = step_data["position"]
        _step.description = step_data["description"]
        _step.free_input = step_data["free_input"]
        _step.text = step_data["text"]
        _step.text2 = step_data["text2"]
        _step.text3 = step_data["text3"]
        _step.text3 = step_data["text3"]
        _step.lecture_id = lecture.id

        db.session.add(_step)
        db.session.commit()
        db.session.refresh(_step)

        steps_uuid[step_data.get("uuid4", str(uuid.uuid4()))] = _step.id

        if step_data["response_type"] == "question":
            for answer_data in step_data["answers"]:
                _answer = Answer()
                _answer.step_id = _step.id
                _answer.parent_id = 0
                _answer.text2match = answer_data["text2match"]
                _answer.description = answer_data["description"]
                _answer.answer_type = answer_data["answer_type"]
                _answer.position = answer_data["position"]
                _answer.text = answer_data["text"]
                _answer.text2 = answer_data["text2"]
                _answer.correct_answer = answer_data["correct_answer"]
                _answer.following_action = answer_data["following_action"]

                db.session.add(_answer)
                db.session.commit()
                db.session.refresh(_answer)

                if _answer.following_action != "step":
                    if _answer.following_action == "lecture" and rewrite_lecture:
                        answers2change[_answer.id] = maybe_int(
                            answer_data.get("following_action_id", 0)
                        )
                    else:
                        _answer.following_action_id = maybe_int(
                            answer_data.get("following_action_id", 0)
                        )
                db.session.add(_answer)
                db.session.commit()
                db.session.refresh(_answer)
                old2new[_answer.id] = maybe_int(
                    answer_data.get("following_action_id", 0)
                )

                for subanswer_data in answer_data["subanswers"]:
                    _subanswer = Answer()
                    _subanswer.text2match = subanswer_data["text2match"]
                    _subanswer.description = subanswer_data["description"]
                    _subanswer.answer_type = subanswer_data["answer_type"]
                    _subanswer.text = subanswer_data["text"]
                    _subanswer.text2 = subanswer_data["text2"]
                    _subanswer.correct_answer = subanswer_data["correct_answer"]
                    _subanswer.position = subanswer_data["position"]
                    _subanswer.correct_answer = subanswer_data["correct_answer"]
                    _subanswer.step_id = _step.id
                    _subanswer.parent_id = _answer.id
                    db.session.add(_subanswer)
                    db.session.commit()
                    db.session.refresh(_subanswer)
        else:
            for substep_data in step_data["substeps"]:
                _substep = Step()
                _substep.step_type = substep_data["step_type"]
                _substep.free_input = substep_data.get("free_input", False)
                _substep.response_type = substep_data["response_type"]
                _substep.description = substep_data["description"]
                _substep.text = substep_data["text"]
                _substep.text2 = substep_data["text2"]
                _substep.text3 = substep_data["text3"]
                _substep.position = substep_data.get("position", 0)
                _substep.parent_id = _step.id
                _substep.lecture_id = lecture.id
                db.session.add(_substep)
                db.session.commit()
                db.session.refresh(_substep)

    for _step in (
        Step.query.filter_by(lecture_id=lecture.id)
        .filter_by(parent_id=0)
        .filter_by(response_type="question")
        .all()
    ):
        for _answer in (
            Answer.query.filter_by(step_id=_step.id)
            .filter_by(parent_id=0)
            .filter_by(following_action="step")
            .all()
        ):
            # step uuid
            step_uuid = old2new.get(_answer.id)
            # assign new step id by uuid
            _answer.following_action_id = steps_uuid.get(step_uuid, 0)
            db.session.add(_answer)
            db.session.commit()

    return lecture, answers2change


@app.template_filter("str2json")
def str2json(str):
    try:
        return json.loads(str)
    except:
        return {}


@app.template_filter("timestamp2date")
def timestamp2date(timestamp):
    return datetime.fromtimestamp(timestamp).strftime("%d.%m.%Y - %H:%M:%S")


@app.template_filter("anything2name")
def anything2name(anything_id, anything_type):
    if anything_type == "course":
        course = Course.query.get(anything_id)
        return course.name if course else ""
    elif anything_type == "lecture":
        lecture = Lecture.query.get(anything_id)
        return lecture.name if lecture else ""
    elif anything_type == "step":
        step = Lecture.query.get(anything_id)
        name = ""
        if step:
            if step.description != "":
                name = step.description
            else:
                name = step.text
        return name
    else:
        return ""


@app.template_filter("type2text")
def type2text(typestr):
    texts = {
        "information": "INFORMACE",
        "pause": "ČASOVAČ",
        "question": "OTÁZKA",
        "again": "Znovu tato otázka",
        "next": "Další krok lekce",
        "lecture": "Spustit jinou lekci",
        "code": "Odeslat kód",
        "course": "Jiný kurz",
        "step": "Jiný krok této lekce",
        "text": "TEXT",
        "image": "OBRÁZEK",
        "video": "VIDEO",
        "link": "ODKAZ",
        "now": "ihned",
        "seconds": "vteřin",
        "minutes": "minut",
        "hours": "hodin",
        "days": "dnů",
        "still": "stále",
    }
    if typestr in texts.keys():
        return texts[typestr]
    else:
        return ""


@app.template_filter("pause2text")
def pause2text(typestr):
    texts = {
        "pause": "Pauza",
        "after_lection_before": "po předchozí lekci",
        "after_lection_start": "po zahájení kurzu",
        "run_at": "spustit",
    }
    if typestr in texts.keys():
        return texts[typestr]
    else:
        return ""


@app.template_filter("type2class")
def type2class(typestr):
    try:
        texts = {
            "information": "success",
            "pause": "info",
            "question": "warning",
        }
        return texts[typestr]
    except:
        return "success"


@admin.route("/", methods=["GET", "POST"])
@login_required
def index():
    return redirect(url_for("admin.courses"))


@admin.route("/courses", methods=["GET", "POST"])
@login_required
def courses():
    return render_template("admin/courses.html")


@admin.route("/courses/new", methods=["GET", "POST"])
@login_required
def course_new():
    try:
        data = request.get_json(silent=True)

        course_id = data.get("course_id", "")
        duplicate_course_id = data.get("duplicate_course_id", "")

        if duplicate_course_id != "":
            _course = Course.query.get(duplicate_course_id)
            course_data = get_course_data(_course, rewrite_lectures=True)
            course_data["company_id"] = 0
            course = import_course_from_data(course_data)
            course.user_id = current_user.id
            course.name = data.get("course_name", "")
            course.description = data.get("course_description", "")
            db.session.add(course)
            db.session.commit()
        else:
            if course_id != "":
                course = Course.query.get(course_id)
            else:
                course = Course()
                course.user_id = current_user.id
                course.company_id = 0

            course.name = data.get("course_name", "")
            course.description = data.get("course_description", "")

            db.session.add(course)
            db.session.commit()

        return jsonify(
            {
                "status": 1,
                "data": {
                    "id": course.id,
                    "name": course.name,
                    "description": course.description,
                },
            }
        )
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/courses/<course_id>", methods=["GET", "POST"])
@login_required
def course_detail(course_id):
    course2show = (
        Course.query.filter_by(user_id=current_user.id).filter_by(id=course_id).first()
    )
    lecture_id = request.args.get("lecture_id", 0, type=int)
    lecture2show = Lecture.query.filter_by(id=lecture_id).first()

    if not course2show or (lecture_id > 0 and lecture2show is None):
        return redirect(url_for("admin.courses"))

    per_page = 20
    position = (
        db.session.query(func.count(Lecture.id))
        .filter_by(course_id=course_id)
        .filter(Lecture.id <= lecture_id)
        .scalar()
    )
    pages = math.ceil(position / per_page)

    lectures = db.session.execute(
        """
    select t1.*, count(t2.id) steps_count
    from lectures t1
    left join lectures_steps t2 on (t2.lecture_id = t1.id and t2.parent_id = 0)
    where t1.course_id = :course_id
    group by t1.id
    order by t1.position
    limit :lectures2show
    """,
        {"lectures2show": pages * per_page, "course_id": course_id},
    ).fetchall()

    return render_template(
        "admin/courses.html",
        course=course2show,
        lecture2show=lecture2show,
        lectures=lectures,
        counter=pages + 1,
    )


@admin.route("/courses/<course_id>/share", methods=["GET", "POST"])
@login_required
def course_share(course_id):
    course2show = (
        Course.query.filter_by(user_id=current_user.id).filter_by(id=course_id).first()
    )

    if not course2show:
        raise Exception("unallowed course")

    return jsonify({"hash": hasher.encode(int(course_id))})
    # return jsonify({"hash": cipher_suite.encrypt(course_id.encode()).decode()})


@admin.route("/ajax/courses/<int:course_id>", methods=["GET", "POST"])
@login_required
def courses_ajax_detail(course_id):
    course = (
        Course.query.filter_by(user_id=current_user.id).filter_by(id=course_id).first()
    )

    if course:
        return jsonify(
            status=1,
            data={
                "id": course.id,
                "name": course.name,
                "description": course.description,
            },
        )
    else:
        return jsonify(status=0)


@admin.route("/courses/<course_id>/delete", methods=["GET", "POST"])
@login_required
def course_delete(course_id):
    msg = ""
    try:
        course = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=course_id)
            .first()
        )
        db.session.delete(course)
        db.session.commit()

        return jsonify({"status": 1})
    except Exception as e:
        print(str(e), flush=True)
        return jsonify({"status": 0, "msg": msg})


@admin.route("/courses/import", methods=["GET", "POST"])
@login_required
def course_import(**kwargs):
    try:
        try:
            course_data = request.get_json(force=True)
        except:
            course_data = json.loads(request.files.get("export").read())

        if course_data.get("export_type", "") != "course":
            raise Exception("Tento json není určen pro kurzy")

        course = import_course_from_data(course_data)
        course.user_id = current_user.id
        course.company_id = 0
        db.session.add(course)
        db.session.commit()

        return jsonify({"status": 1})
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/courses/<course_id>/import-lecture", methods=["GET", "POST"])
@login_required
def lecture_import(course_id, **kwargs):
    try:
        try:
            data = request.get_json(force=True)
        except:
            data = json.loads(request.files.get("export").read())

        if data.get("export_type", "") != "lecture":
            raise Exception("Tento json není určen pro lekce")

        _course = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=course_id)
            .first()
        )
        if not _course:
            raise Exception("Unallowed course!")

        lecture, _ = create_lecture_from_data(data)
        lecture.course_id = course_id
        db.session.add(lecture)
        db.session.commit()

        return jsonify({"status": 1})
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/courses/<course_id>/export", methods=["GET", "POST"])
@login_required
def course_export(course_id, **kwargs):
    try:
        _course = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=course_id)
            .first()
        )

        if not _course:
            raise Exception("unallowed course export")

        data = get_course_data(_course, rewrite_lectures=True)

        result = jsonify(data)
        result.headers["Content-Disposition"] = (
            "attachment;filename=export_course_" + str(course_id) + ".json"
        )
        return result
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/ajax/courses", methods=["GET", "POST"])
@login_required
def courses_ajax():
    page = request.args.get("p", 1, type=int)
    search = request.args.get("s", "")

    per_page = 20
    offset = (page - 1) * per_page

    courses = db.session.execute(
        f"""
    select t1.*
    from courses t1
    where (t1.name like :search or t1.description like :search) and t1.user_id = :user_id
    group by t1.id
    order by t1.name
    limit :offset, :limit
    """,
        {
            "offset": offset,
            "limit": per_page,
            "search": "%" + search + "%",
            "user_id": current_user.id,
        },
    ).fetchall()

    courses2send = []

    for course in courses:
        courses2send.append(
            {
                "course_id": str(course.id),
                "name": course.name,
                "description": course.description,
            }
        )

    return jsonify(courses=courses2send)


@admin.route("/ajax/courses/dropdown", methods=["GET", "POST"])
@login_required
def courses_ajax_dropdown():
    try:
        _courses = (
            Course.query.filter_by(user_id=current_user.id).order_by(Course.id).all()
        )
        courses = []
        for _course in _courses:
            courses.append({"id": _course.id, "title": _course.name})
        return jsonify(data=courses, status=1)
    except Exception as e:
        return jsonify(data=[], status=str(e))


@admin.route("/ajax/lectures/dropdown", methods=["GET", "POST"])
@login_required
def lectures_ajax_dropdown():
    try:
        course_id = request.args.get("course_id", 0)
        _course = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=course_id)
            .first()
        )
        if not _course:
            raise Exception("unallowed course!")
        _lectures = (
            Lecture.query.filter_by(course_id=course_id)
            .order_by(Lecture.position)
            .all()
        )
        lectures = []

        for _lecture in _lectures:
            lectures.append({"id": _lecture.id, "title": _lecture.name})
        return jsonify(data=lectures, status=1)
    except:
        return jsonify(data=[], status=0)


@admin.route("/ajax/lectures/last-edited", methods=["GET", "POST"])
@login_required
def lectures_ajax_last_edited():
    try:
        course_id = request.args.get("course_id", 0)
        _course = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=course_id)
            .first()
        )
        if not _course:
            raise Exception("unallowed course!")
        _lectures = (
            Lecture.query.filter_by(course_id=course_id)
            .order_by(Lecture.position)
            .all()
        )
        lectures = []

        for _lecture in _lectures:
            lectures.append(
                {
                    "id": _lecture.id,
                    "last_edited": _lecture.last_edited.strftime("%d.%m.%Y"),
                }
            )
        return jsonify(data=lectures, status=1)
    except:
        return jsonify(data=[], status=0)


@admin.route("/ajax/lecture2steps/<lecture_id>/dropdown", methods=["GET", "POST"])
@login_required
def lecture2steps_ajax_dropdown(lecture_id, **kwargs):
    try:
        _steps = (
            Step.query.filter_by(lecture_id=lecture_id)
            .filter_by(parent_id=0)
            .order_by(Step.position)
            .all()
        )
        steps = []
        for _step in _steps:
            title = _step.description if _step.description != "" else _step.text
            if _step.response_type == "pause":
                if _step.description in ["run_at", "pause"]:
                    title = f"{pause2text(_step.description)} {_step.text} {type2text(_step.text2)}".strip()
                else:
                    title = f"{_step.text} {type2text(_step.text2)} {pause2text(_step.description)}".strip()
            steps.append({"id": _step.id, "title": title})
        return jsonify(data=steps, status=1)
    except:
        return jsonify(data=[], status=0)


@admin.route("/ajax/lectures", methods=["GET", "POST"])
@login_required
def lectures_ajax():
    page = request.args.get("p", 1, type=int)
    search = request.args.get("s", "")
    course_id = request.args.get("course_id", 0, type=int)

    _course = (
        Course.query.filter_by(user_id=current_user.id).filter_by(id=course_id).first()
    )
    if not _course:
        raise Exception("unallowed course!")

    per_page = 20
    offset = (page - 1) * per_page

    lectures = db.session.execute(
        f"""
    select t1.*, count(t2.id) steps_count
    from lectures t1
    left join lectures_steps t2 on (t2.lecture_id = t1.id and t2.parent_id = 0)
    where (t1.name like :search or t1.description like :search) and t1.course_id = :course_id
    group by t1.id
    order by t1.position
    limit :offset, :limit
    """,
        {
            "offset": offset,
            "limit": per_page,
            "search": "%" + search + "%",
            "course_id": course_id,
        },
    ).fetchall()

    lectures2send = []

    for lecture in lectures:
        lectures2send.append(
            {
                "lecture_id": str(lecture.id),
                "name": lecture.name,
                "description": lecture.description,
                "last_edited": lecture.last_edited.strftime("%d.%m.%Y"),
                "steps_count": str(lecture.steps_count),
            }
        )

    return jsonify(lectures=lectures2send)


@admin.route("/lectures/new", methods=["GET", "POST"])
@login_required
def lecture_new(**kwargs):
    try:
        data = request.get_json(silent=True)

        lecture_id = data.get("lecture_id", "")
        course_id = data.get("course_id", "")

        _course = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=course_id)
            .first()
        )
        if not _course:
            raise Exception("unallowed course!")

        if lecture_id != "":
            lecture = Lecture.query.get(lecture_id)
        else:
            position = db.session.query(func.max(Lecture.position)).scalar()
            lecture = Lecture()
            lecture.course_id = course_id
            lecture.position = (position or 0) + 1

        lecture.name = data.get("lecture_name", "")
        lecture.description = data.get("lecture_description", "")
        lecture.last_edited = datetime.now(tz.gettz("Europe/Prague"))
        db.session.add(lecture)
        db.session.commit()

        return jsonify(
            {
                "status": 1,
                "data": {
                    "id": lecture.id,
                    "name": lecture.name,
                    "description": lecture.description,
                    "last_edited": lecture.last_edited.strftime("%d.%m.%Y"),
                },
            }
        )
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/ajax/lecture/<lecture_id>", methods=["GET", "POST"])
@login_required
def lecture_ajax_detail(lecture_id):
    try:
        lecture = Lecture.query.get(lecture_id)

        if lecture.course_id:
            _course = (
                Course.query.filter_by(user_id=current_user.id)
                .filter_by(id=lecture.course_id)
                .first()
            )
            if not _course:
                raise Exception("unallowed course!")

        data2send = {
            "id": lecture.id,
            "name": lecture.name,
            "description": lecture.description,
            "course_id": lecture.course_id or 0,
            "steps": [],
        }
        for step in (
            Step.query.filter_by(lecture_id=lecture_id)
            .filter_by(parent_id=0)
            .order_by(Step.position)
            .all()
        ):
            answers = []
            _answers = (
                Answer.query.filter_by(step_id=step.id).order_by(Answer.position).all()
            )
            if len(_answers) > 0:
                for answer in _answers:
                    answers.append(
                        {
                            "id": str(answer.id),
                            "text": answer.text,
                            "text2match": answer.text2match,
                            "answer_type": answer.answer_type,
                            "parent_id": answer.parent_id,
                            "following_action": answer.following_action,
                        }
                    )
            data2send["steps"].append(
                {
                    "id": step.id,
                    "description": step.description,
                    "text": step.text,
                    "text2": step.text2,
                    "text3": step.text3,
                    "type": step.step_type,
                    "response_type": step.response_type,
                    "free_input": step.free_input,
                    "step_type": step.step_type,
                    "answers": answers,
                }
            )

        return jsonify({"status": 1, "data": data2send})
    except Exception as e:
        return jsonify({"status": 0, "data": {}, "msg": str(e)})


@admin.route("/lectures/<lecture_id>/visualize", methods=["GET", "POST"])
@login_required
def lecture_visualize(lecture_id):
    lecture2show = Lecture.query.get(lecture_id)
    course2show = (
        Course.query.filter_by(user_id=current_user.id)
        .filter_by(id=lecture2show.course_id)
        .first()
    )
    if not course2show:
        raise Exception("unallowed course!")
    html2return = render_template(
        "admin/visualize.html", lecture=lecture2show, course=course2show
    )
    return jsonify({"status": 1, "html": html2return})


@admin.route("/lectures/<lecture_id>/duplicate", methods=["GET", "POST"])
@login_required
def lecture_duplicate(lecture_id):
    try:
        _lecture = Lecture.query.get(lecture_id)

        course2show = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=_lecture.course_id)
            .first()
        )
        if not course2show:
            raise Exception("unallowed course!")

        _lectures2fix = (
            Lecture.query.filter_by(course_id=_lecture.course_id)
            .filter(Lecture.position > _lecture.position)
            .all()
        )

        for _lecture2fix in _lectures2fix:
            _lecture2fix.position = _lecture2fix.position + 1
            db.session.add(_lecture2fix)
            db.session.commit()

        lecture_data = get_lecture_data(_lecture)
        lecture, _ = create_lecture_from_data(lecture_data)
        lecture.course_id = _lecture.course_id
        lecture.position = _lecture.position + 1
        lecture.last_edited = datetime.now(tz.gettz("Europe/Prague"))
        db.session.add(lecture)
        db.session.commit()

        return jsonify({"status": 1})
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/lectures/<lecture_id>/export", methods=["GET", "POST"])
@login_required
def lecture_export(lecture_id):
    try:
        _lecture = Lecture.query.get(lecture_id)

        course2show = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=_lecture.course_id)
            .first()
        )
        if not course2show:
            raise Exception("unallowed course!")

        data = get_lecture_data(_lecture, rewrite_lectures=True)
        result = jsonify(data)
        result.headers["Content-Disposition"] = (
            "attachment;filename=export_lecture_" + str(lecture_id) + ".json"
        )
        return result
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/lectures/<lecture_id>/delete", methods=["GET", "POST"])
@login_required
def lecture_delete(lecture_id, **kwargs):
    try:
        lecture = Lecture.query.get(lecture_id)

        course2show = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=lecture.course_id)
            .first()
        )
        if not course2show:
            raise Exception("unallowed course!")

        db.session.delete(lecture)
        db.session.commit()

        position = 1
        for lecture in (
            Lecture.query.filter_by(course_id=lecture.course_id)
            .order_by(Lecture.position)
            .all()
        ):
            lecture.position = position
            position += 1
            db.session.add(lecture)
            db.session.commit()
        return jsonify({"status": 1})
    except:
        return jsonify({"status": 0})


@admin.route("/lectures/<lecture_id>/move-up", methods=["GET", "POST"])
@login_required
def lecture_move_up(lecture_id, **kwargs):
    try:
        lecture = Lecture.query.get(lecture_id)

        course2show = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=lecture.course_id)
            .first()
        )
        if not course2show:
            raise Exception("unallowed course!")

        lecture2swap = (
            Lecture.query.filter_by(course_id=lecture.course_id)
            .filter_by(position=lecture.position - 1)
            .first()
        )

        if lecture2swap and lecture2swap.position:
            lecture2swap.position += 1
            lecture.position -= 1
            lecture.last_edited = datetime.now(tz.gettz("Europe/Prague"))
            db.session.add(lecture)
            db.session.add(lecture2swap)
            db.session.commit()
            db.session.refresh(lecture)
            db.session.refresh(lecture2swap)

        position = 1
        _lectures = []
        for lecture in (
            Lecture.query.filter_by(course_id=lecture.course_id)
            .order_by(Lecture.position)
            .all()
        ):
            lecture.position = position
            position += 1
            db.session.add(lecture)
            _lectures.append(lecture.id)
            db.session.commit()

        return jsonify({"status": 1})
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/lectures/<lecture_id>/move-down", methods=["GET", "POST"])
@login_required
def lecture_move_down(lecture_id):
    try:
        lecture = Lecture.query.get(lecture_id)
        course2show = (
            Course.query.filter_by(user_id=current_user.id)
            .filter_by(id=lecture.course_id)
            .first()
        )
        if not course2show:
            raise Exception("unallowed course!")

        lecture2swap = (
            Lecture.query.filter_by(course_id=lecture.course_id)
            .filter_by(position=lecture.position + 1)
            .first()
        )

        if lecture2swap and lecture2swap.position:
            lecture2swap.position -= 1
            lecture.position += 1
            lecture.last_edited = datetime.now(tz.gettz("Europe/Prague"))
            db.session.add(lecture)
            db.session.add(lecture2swap)
            db.session.commit()
            db.session.refresh(lecture)
            db.session.refresh(lecture2swap)

        position = 1
        _lectures = []
        for lecture in (
            Lecture.query.filter_by(course_id=lecture.course_id)
            .order_by(Lecture.position)
            .all()
        ):
            lecture.position = position
            position += 1
            db.session.add(lecture)
            _lectures.append(lecture.id)
            db.session.commit()

        return jsonify({"status": 1})
    except:
        return jsonify({"status": 0})


##############
# STEPS
##############


@admin.route("/steps/new", methods=["GET", "POST"])
@login_required
def steps_new():
    try:
        data = request.get_json(silent=True)
        lecture_id = data.get("lecture_id") if data.get("lecture_id") != "" else None

        parent_id = 0
        for _index, _step in enumerate(data["steps"]):
            step_id = _step.get("step_id") if _step.get("step_id") != "" else None
            step = Step.query.get(step_id)

            if not step:
                step = Step()
                position = db.session.query(func.max(Step.position)).scalar()
                step.position = (position or 0) + 1
                step.lecture_id = lecture_id

            step.description = _step.get("step_description", "")
            step.text = _step.get("step_text", "")
            step.text2 = _step.get("step_text2", "")
            step.text3 = _step.get("step_text3", "")
            step.response_type = (
                data.get("response_type", "information")
                if data.get("response_type") in ["question", "pause", "information"]
                else "information"
            )
            step.step_type = (
                _step.get("step_type", "text")
                if _step.get("step_type") in ["text", "image", "video", "link"]
                else "text"
            )
            step.free_input = data.get("free_input", False)
            step.parent_id = parent_id

            if _index:
                step.position = _index + 1

            db.session.add(step)
            db.session.commit()
            db.session.refresh(step)

            if _index == 0:
                parent_id = step_id or step.id

            if step.free_input and step_id:
                _answers = Answer.query.filter_by(step_id=step.id).all()

                if len(_answers) < 3:
                    for i in range(3 - len(_answers)):
                        _answer2append = Answer()
                        _answer2append.step_id = step.id
                        _answer2append.following_action = "again"
                        _answer2append.parent_id = 0
                        db.session.add(_answer2append)
                        db.session.commit()

                _answers = Answer.query.filter_by(step_id=step.id).all()
                for index, _answer in enumerate(_answers):
                    if index == 0:
                        _answer.text = "Správná odpověď"
                    elif index == 1:
                        _answer.text = "Cokoliv jiného"

                    elif index == 2:
                        _answer.text = "2x špatně"

                    _answer.position = index

                    if index < 3:
                        db.session.add(_answer)
                    else:
                        db.session.delete(_answer)
                    db.session.commit()

            lecture2update = Lecture.query.filter_by(id=lecture_id).first()
            if lecture2update:
                lecture2update.last_edited = datetime.now(tz.gettz("Europe/Prague"))
                db.session.add(lecture2update)
                db.session.commit()

        return jsonify({"status": 1, "step_id": step.id})
    except:
        return jsonify({"status": 0})
    ...


@admin.route("/ajax/steps/<step_id>/duplicate", methods=["GET", "POST"])
@login_required
def step_duplicate(step_id):
    try:
        step2update = Step.query.filter_by(id=step_id).first()
        if step2update:
            lecture_id = step2update.lecture_id
            lecture2update = Lecture.query.filter_by(id=lecture_id).first()
            if lecture2update:
                lecture2update.last_edited = datetime.now(tz.gettz("Europe/Prague"))
                db.session.add(lecture2update)
                db.session.commit()

        _step = Step.query.get(step_id)

        step_copy = Step()
        step_copy.step_type = _step.step_type
        step_copy.free_input = _step.free_input
        step_copy.response_type = _step.response_type
        step_copy.description = _step.description
        step_copy.text = _step.text
        step_copy.text2 = _step.text2
        step_copy.text3 = _step.text3
        step_copy.parent_id = _step.parent_id
        # position = db.session.query(func.max(Step.position)).scalar()

        _steps2fix = (
            Step.query.filter_by(lecture_id=_step.lecture_id)
            .filter(Step.position > _step.position)
            .all()
        )

        for _step2fix in _steps2fix:
            _step2fix.position = _step2fix.position + 1
            db.session.add(_step2fix)
            db.session.commit()

        step_copy.position = _step.position + 1
        step_copy.lecture_id = _step.lecture_id
        db.session.add(step_copy)
        db.session.commit()
        db.session.refresh(step_copy)

        if _step.response_type == "question":
            _answers = (
                Answer.query.filter_by(step_id=_step.id).filter_by(parent_id=0).all()
            )
            for _answer in _answers:
                answer_copy = _answer.copy()
                answer_copy.step_id = step_copy.id
                answer_copy.parent_id = 0
                answer_copy.position = _answer.position
                db.session.add(answer_copy)
                db.session.commit()
                db.session.refresh(answer_copy)

                child_answers = (
                    Answer.query.filter_by(step_id=_step.id)
                    .filter_by(parent_id=_answer.id)
                    .all()
                )
                for child_answer in child_answers:
                    child_answer_copy = child_answer.copy()
                    child_answer_copy.step_id = step_copy.id
                    child_answer_copy.parent_id = answer_copy.id
                    db.session.add(child_answer_copy)
                    db.session.commit()
        else:
            child_steps = (
                Step.query.filter_by(lecture_id=_step.lecture_id)
                .filter_by(parent_id=_step.id)
                .all()
            )
            for child_step in child_steps:
                child_step_copy = child_step.copy()
                child_step_copy.parent_id = step_copy.id
                child_step_copy.lecture_id = _step.lecture_id
                db.session.add(child_step_copy)
                db.session.commit()

        return jsonify({"status": 1})
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/ajax/steps/<step_id>", methods=["GET", "POST"])
@login_required
def step_detail(step_id):
    try:
        step = Step.query.get(step_id)
        data2send = []
        data2send.append(
            {
                "id": step.id,
                "description": step.description,
                "text": step.text,
                "text2": step.text2,
                "text3": step.text3,
                "step_type": step.step_type,
                "free_input": getattr(step, "free_input", False),
            }
        )
        steps2show = (
            Step.query.filter_by(parent_id=step_id).order_by(Step.position).all()
        )
        for step2show in steps2show:
            data2send.append(
                {
                    "id": step2show.id,
                    "description": step2show.description,
                    "text": step2show.text,
                    "text2": step2show.text2,
                    "text3": step2show.text3,
                    "step_type": step2show.step_type,
                }
            )
        return jsonify({"status": 1, "data": data2send})
    except:
        return jsonify({"status": 0, "data": {}})


@admin.route("/ajax/steps/<step_id>/delete", methods=["GET", "POST"])
@login_required
def step_delete(step_id):
    try:
        step = Step.query.get(step_id)
        db.session.delete(step)
        db.session.commit()

        step2update = Step.query.filter_by(id=step_id).first()
        if step2update:
            lecture_id = step2update.lecture_id
            lecture2update = Lecture.query.filter_by(id=lecture_id).first()
            if lecture2update:
                lecture2update.last_edited = datetime.now(tz.gettz("Europe/Prague"))
                db.session.add(lecture2update)
                db.session.commit()
        return jsonify({"status": 1})
    except:
        return jsonify({"status": 0})


@admin.route("/ajax/steps/reorder", methods=["GET", "POST"])
@login_required
def reorder_steps():
    try:
        data = request.get_json(silent=True)
        sort = data.get("sort", [])

        cnt = 1
        _steps = []
        for step_id in sort:
            step = Step.query.get(step_id)
            step.position = cnt
            cnt += 1
            _steps.append(step.id)
            db.session.add(step)
            db.session.commit()

        step2update = Step.query.filter_by(id=step_id).first()
        if step2update:
            lecture_id = step2update.lecture_id
            lecture2update = Lecture.query.filter_by(id=lecture_id).first()
            if lecture2update:
                lecture2update.last_edited = datetime.now(tz.gettz("Europe/Prague"))
                db.session.add(lecture2update)
                db.session.commit()

        return jsonify({"status": 1})
    except:
        return jsonify({"status": 0})


@admin.route("/ajax/answers/new", methods=["GET", "POST"])
@login_required
def answer_new():
    try:
        data = request.get_json(silent=True)

        step_id = data.get("step_id") if data.get("step_id") != "" else None
        step2update = Step.query.filter_by(id=step_id).first()
        if step2update:
            lecture_id = step2update.lecture_id
            lecture2update = Lecture.query.filter_by(id=lecture_id).first()
            if lecture2update:
                lecture2update.last_edited = datetime.now(tz.gettz("Europe/Prague"))
                db.session.add(lecture2update)
                db.session.commit()

        answers2check = data.get("answers", [])

        if len(answers2check) < 1 and step_id:
            answer = Answer()
            answer.step_id = step_id
            if not step2update.free_input:
                answer.text = data.get("text", "")
            answer.text2match = data.get("text2match", "")
            answer.parent_id = 0
            answer.following_action = "again"
            answer.answer_type = "text"
            answer.position = 0
            db.session.add(answer)
            db.session.commit()
            return jsonify({"status": 1})

        parent_id = 0
        for _index, _answer in enumerate(data["answers"]):
            answer_id = (
                _answer.get("answer_id") if _answer.get("answer_id") != "" else None
            )

            answer = Answer.query.get(answer_id)

            if not answer:
                answer = Answer()
                answer.step_id = step_id

            answer.description = _answer.get("answer_description", "")
            answer.text2 = _answer.get("answer_text2", "")
            answer.answer_type = (
                _answer.get("answer_type", "text")
                if _answer.get("answer_type", "text")
                in ["text", "image", "video", "link", "pause"]
                else "text"
            )
            answer.parent_id = parent_id
            answer.position = 0

            if _index:
                answer.position = _index + 1
            else:
                answer.following_action = data.get("following_action", "")
                answer.following_action_id = (
                    data.get("following_action_id")
                    if data.get("following_action_id")
                    else 0
                )
                answer.correct_answer = True if data.get("correct_answer") else False
                answer.text2match = data.get("text2match", "")
                if not step2update.free_input:
                    answer.text = data.get("text", "")

            db.session.add(answer)
            db.session.commit()

            if not _index:
                parent_id = answer.id

        return jsonify({"status": 1})
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


@admin.route("/ajax/answers/<answer_id>", methods=["GET", "POST"])
@login_required
def answer_detail(answer_id):
    try:
        answer = Answer.query.get(answer_id)
        step = Step.query.get(answer.step_id)
        data2send = []
        data2send.append(
            {
                "id": answer.id,
                "text2match": answer.text2match,
                "following_action": answer.following_action,
                "following_action_id": answer.following_action_id,
                "correct_answer": True if bool(answer.correct_answer) else False,
                "description": answer.description,
                "text": answer.text,
                "text2": answer.text2,
                "answer_type": answer.answer_type,
                "question_free_input": step.free_input,
            }
        )
        answers2show = (
            Answer.query.filter_by(parent_id=answer_id).order_by(Answer.position).all()
        )
        for answer2show in answers2show:
            data2send.append(
                {
                    "id": answer2show.id,
                    "description": answer2show.description,
                    "text": answer2show.text,
                    "text2": answer2show.text2,
                    "answer_type": answer2show.answer_type,
                }
            )
        return jsonify({"status": 1, "data": data2send})
    except:
        return jsonify({"status": 0, "data": {}})


@admin.route("/ajax/answers/<answer_id>/delete", methods=["GET", "POST"])
@login_required
def answer_delete(answer_id):
    try:
        answer = Answer.query.get(answer_id)
        db.session.delete(answer)
        db.session.commit()
        return jsonify({"status": 1})
    except:
        return jsonify({"status": 0})


@admin.route("/ajax/answers/reorder", methods=["GET", "POST"])
@login_required
def answer_reorder():
    try:
        data = request.get_json(silent=True)
        sort = data.get("sort", [])

        cnt = 1
        _answers = []
        for answer_id in sort:
            answer = Answer.query.get(answer_id)
            answer.position = cnt
            cnt += 1
            _answers.append(answer.id)
            db.session.add(answer)
            db.session.commit()

        return jsonify({"status": 1})
    except:
        return jsonify({"status": 0})


##################################


@admin.route("/ajax/pause/new", methods=["GET", "POST"])
@login_required
def pause_new():
    try:
        data = request.get_json(silent=True)
        step_id = data.get("step_id", "")
        lecture_id = data.get("lecture_id", "")

        if step_id != "":
            pause = Step.query.get(step_id)
        else:
            position = (
                db.session.query(func.max(Step.position))
                .filter(Step.lecture_id == lecture_id)
                .scalar()
                or 0
            )
            pause = Step()
            pause.lecture_id = lecture_id
            pause.position = position + 1
            pause.parent_id = 0
            pause.step_type = "text"
            pause.response_type = "pause"

        pause.text = data.get("text", "")
        pause.text2 = data.get("text2", "")
        pause.text3 = data.get("text3", "")
        pause.description = data.get("description", "")

        db.session.add(pause)
        db.session.commit()

        lecture2update = Lecture.query.filter_by(id=lecture_id).first()
        if lecture2update:
            lecture2update.last_edited = datetime.now(tz.gettz("Europe/Prague"))
            db.session.add(lecture2update)
            db.session.commit()
        return jsonify({"status": 1})
    except Exception as e:
        return jsonify({"status": 0, "msg": str(e)})


###################################


@admin.route("/upload-images", methods=["GET", "POST"])
@login_required
def upload_images():
    if request.method == "POST":
        file = request.files.get("file")
        if file and (file.filename == "blob" or allowed_file(file.filename)):
            try:
                img = Image.open(file.stream)
                img.verify()
                file.seek(0)
                filename_extension = file.filename.split(".")[-1]
                if filename_extension == "blob":
                    filename_extension = img.format.lower()
                filename = str(uuid.uuid4()) + "." + filename_extension
                file.save(os.path.join(basedir, "static/uploads/", filename))
                return jsonify(status="1", filename=filename)
            except Exception as e:
                return jsonify(status="0", message="Invalid image!" + str(e))
        return jsonify(status="0", message="Invalid image!")
    return jsonify(status="0", message="Invalid image!")


@admin.route("/remove-image", methods=["GET", "POST"])
@login_required
def remove_images():
    try:
        data = request.get_json(silent=True)
        filename = data.get("filename", "")
        target_type = data.get("target_type", "")
        target_id = data.get("target_id", "")

        if filename != "":
            if target_type != "" and target_id != "":
                if target_type == "step":
                    obj2replace = (
                        Step.query.filter_by(text=filename)
                        .filter_by(id=target_id)
                        .first()
                    )
                    if obj2replace:
                        obj2replace.text = ""
                elif target_type == "answer":
                    obj2replace = (
                        Answer.query.filter_by(text2=filename)
                        .filter_by(id=target_id)
                        .first()
                    )
                    if obj2replace:
                        obj2replace.text2 = ""

                if obj2replace:
                    db.session.add(obj2replace)
                    db.session.commit()

            return jsonify(status="1")
    except:
        return jsonify(status="0")


@admin.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    logout_user()
    flash("Úspěšně odhlášeno", "info")
    return redirect(url_for("public.login"))
