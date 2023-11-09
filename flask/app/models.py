from app import db, login_manager
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from time import time
import jwt
from app import app


@login_manager.user_loader
def load_user(user_id):
    user = User.query.get(user_id)
    return user


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), default="")
    email = db.Column(db.String(255), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    email = db.Column(db.String(255), unique=True, index=True)
    courses = db.relationship(
        "Course", backref="user", lazy=True, cascade="all, delete-orphan"
    )

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key == "password":
                value = generate_password_hash(value)
            setattr(self, key, value)

    def check_password(self, password):
        try:
            return check_password_hash(self.password_hash, password)
        except:
            return False

    def set_password(self, password2hash):
        self.password_hash = generate_password_hash(password2hash)

    def get_reset_password_token(self, expires_in=600):
        return jwt.encode(
            {"reset_password": self.id, "exp": time() + expires_in},
            app.config["SECRET_KEY"],
            algorithm="HS256",
        )

    @staticmethod
    def verify_reset_password_token(token):
        try:
            id = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])[
                "reset_password"
            ]
        except:
            return
        return User.query.get(id)

    def __repr__(self):
        return f"User {self.email}"


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.String(255), default="", index=True)
    type_name = db.Column(db.String(255))
    timestamp = db.Column(db.Float)
    intent_name = db.Column(db.String(255), default="")
    action_name = db.Column(db.String(255), default="")
    data = db.Column(db.Text(4294000000))


class Lecture(db.Model):
    __tablename__ = "lectures"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), default="")
    description = db.Column(db.Text(4294000000))
    steps = db.relationship(
        "Step", backref="step", lazy=True, cascade="all, delete-orphan"
    )
    last_edited = db.Column(db.DateTime)
    position = db.Column(db.Integer, default=0, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=True)

    def copy(self):
        new = Lecture()
        new.name = self.name
        new.description = self.description
        for step in self.steps:
            new.steps.append(step.copy())
        new.last_edited = self.last_edited
        new.position = self.position
        return new


class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), default="")
    description = db.Column(db.Text(4294000000))
    lectures = db.relationship(
        "Lecture", backref="lecture", lazy=True, cascade="all, delete-orphan"
    )
    company_id = db.Column(db.Integer, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    def copy(self):
        new = Course()
        new.name = self.name
        new.description = self.description
        for lecture in self.lectures:
            print(lecture, flush=True)
            new.lectures.append(lecture.copy())
        return new


class Step(db.Model):
    __tablename__ = "lectures_steps"

    id = db.Column(db.Integer, primary_key=True)
    step_type = db.Column(db.String(255), default="")
    free_input = db.Column(db.Boolean, default=False)
    response_type = db.Column(db.String(255), default="")
    description = db.Column(db.Text(4294000000))
    text = db.Column(db.Text(4294000000))
    text2 = db.Column(db.Text(4294000000))
    text3 = db.Column(db.Text(4294000000), default="")
    parent_id = db.Column(db.Integer)
    lecture_id = db.Column(db.Integer, db.ForeignKey("lectures.id"), nullable=False)
    answers = db.relationship(
        "Answer", backref="answer", lazy=True, cascade="all, delete-orphan"
    )
    position = db.Column(db.Integer, default=0, nullable=False)

    def copy(self):
        new = Step()
        new.step_type = self.step_type
        new.free_input = self.free_input
        new.response_type = self.response_type
        new.description = self.description
        new.text = self.text
        new.text2 = self.text2
        new.text3 = self.text3
        new.parent_id = self.parent_id
        new.lecture_id = self.lecture_id
        new.position = self.position
        for answer in self.answers:
            new.answers.append(answer.copy())
        return new


class Answer(db.Model):
    __tablename__ = "lectures_answers"

    id = db.Column(db.Integer, primary_key=True)
    step_id = db.Column(db.Integer, db.ForeignKey("lectures_steps.id"), nullable=True)
    text2match = db.Column(db.Text(4294000000))
    description = db.Column(db.Text(4294000000))
    answer_type = db.Column(db.String(255), default="")
    text = db.Column(db.Text(4294000000))
    text2 = db.Column(db.Text(4294000000))
    parent_id = db.Column(db.Integer)
    correct_answer = db.Column(db.Boolean, default=False)
    following_action = db.Column(db.String(255), default="")
    following_action_id = db.Column(db.String(255), default="")
    position = db.Column(db.Integer, default=0, nullable=False)

    def copy(self):
        new = Answer()
        new.step_id = self.step_id
        new.text2match = self.text2match
        new.description = self.description
        new.answer_type = self.answer_type
        new.text = self.text
        new.text2 = self.text2
        new.parent_id = self.parent_id
        new.correct_answer = self.correct_answer
        new.following_action = self.following_action
        new.following_action_id = self.following_action_id
        new.position = self.position
        return new


class EventsSlot(db.Model):
    __tablename__ = "events_slots"

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.String(255), default="")
    key2find = db.Column(db.String(255), default="")
    value = db.Column(db.Text(), default="")

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)


class PlannedTask(db.Model):
    __tablename__ = "planned_tasks"

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.String(255))
    sender_id = db.Column(db.String(255))
    eta = db.Column(db.DateTime)
    is_finished = db.Column(db.Boolean, default=0)

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
