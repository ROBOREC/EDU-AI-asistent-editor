import os
from flask import (
    render_template,
    url_for,
    flash,
    redirect,
    request,
    Blueprint,
    jsonify,
    redirect,
)
from flask_login import login_user, current_user
from flask.helpers import safe_join
from app import db, basedir, app
from cryptography.fernet import Fernet
from hashids import Hashids
from app.mail import send_email
from app.models import User, Course
from app.public.forms import (
    RegistrationForm,
    LoginForm,
    ResetPasswordForm,
    ResetPasswordRequestForm,
)
import requests

public = Blueprint("public", __name__)

cipher_suite = Fernet(b"CLbOShYydTCn6udFzYOXj5C4OqrQ8Rz15hTtL4sSLDI=")
hasher = Hashids("7qsnqSGiOlZdQOUQzXrM")


@public.route("/", methods=["GET", "POST"])
def index():
    return redirect(url_for("public.login"))


@public.route("/course/<hash>")
def share_webchat(hash):
    try:
        # course_id = cipher_suite.decrypt(hash.encode()).decode()
        course_id = hasher.decode(hash)[0]
        course = Course.query.filter_by(id=course_id).first()
        if not course:
            raise Exception()
    except:
        return "course not found"

    return (
        """
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<script>
	localStorage.removeItem("chat_session");
	!function(){let e=document.createElement("script"),t=document.head||document.getElementsByTagName("head")[0];e.src="https://cdn.jsdelivr.net/npm/rasa-webchat@1.0.1/lib/index.js",e.async=!0,e.onload=(()=>{window.WebChat.default({
		customData:{current_url:window.location.href,custom_course:"""
        + str(course_id)
        + """},
		initPayload: "/get_started",
		socketUrl:'"""
        + os.environ.get("RASA_URL", "FILL_RASA_URL")
        + """',
		title: "Kurz: """
        + str(course.name)
        + """",
		inputTextFieldHint: "",
		customMessageDelay: (message) => {
			return 250;
		}
	},null)
	}),t.insertBefore(e,t.firstChild)}();</script>
	<style>
	@media (max-width: 576px) {.rw-replies .rw-reply {font-size: 14px;}}
	body {
		background-image: url('"""
        + os.environ.get("PROJECT_URL", "FILL_PROJECT_URL")
        + """/static/media/img/chat-background.jpg');
	}
	@media screen and (min-width: 800px) {
		.rw-messages-container {
			height: 550px !important;
			max-height: 65vh !important;
		}
		.rw-widget-container .rw-conversation-container {
			width: 450px !important;
		}
  	}
	.rw-conversation-container .rw-image-frame {
		height: auto !important;
	}

	.rw-conversation-container .rw-send .rw-send-icon {
  		fill: #135afe !important;
	}

	.rw-messages-container {
		background-color: transparent;
		background-image: url('"""
        + os.environ.get("PROJECT_URL", "FILL_PROJECT_URL")
        + """/static/uploads/back-tabs-250.png');
	}

	.rw-conversation-container .rw-response {
		background-color: white !important;
	}

	.rw-conversation-container .rw-new-message {
		background-color: white;
	}

	.rw-conversation-container .rw-sender {
		background-color: white;
	}

	.rw-conversation-container .rw-send {
		background: white;
	}
	</style>
	<script>
	window.onload = function(){
   	setTimeout(function() {
		
		if (![...document.querySelector(".rw-widget-container").classList].includes("rw-chat-open")) {
			document.querySelector('.rw-launcher').click();
		}
		
   	}, 500);
	};
	</script>
	"""
    )


@public.route("/register", methods=["GET", "POST"])
def register():

    if os.getenv("ALLOW_REGISTER") != "1":
        flash("Registrace není povolena!", "warning")
        return redirect(url_for("public.login"))

    form = RegistrationForm()

    if form.validate_on_submit():
        user = User(name=form.name.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)

        flash("Díky za registraci!", "info")
        return redirect(url_for("public.login"))

    return render_template("public/register.html", form=form)


@public.route("/reset-password", methods=["GET", "POST"])
def reset_password():

    form = ResetPasswordRequestForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            send_email(
                subject="Reset hesla",
                recipients=[user.email],
                html=render_template(
                    "public/email.html",
                    reset_url=url_for(
                        "public.reset_password_token",
                        token=user.get_reset_password_token(),
                        _external=True,
                    ),
                    project_url=os.environ.get("PROJECT_URL", "FILL_PROJECT_URL"),
                ),
            )

            flash("Email s odkazem pro reset hesla byl odeslán", "info")
        return redirect(url_for("public.login"))

    return render_template("public/reset_password_request.html", form=form)


@public.route("/reset-password/<token>", methods=["GET", "POST"])
def reset_password_token(token):
    if current_user.is_authenticated:
        return redirect(url_for("public.choose_company"))

    user = User.verify_reset_password_token(token)
    if not user:
        return redirect(url_for("public.login"))

    form = ResetPasswordForm()
    if form.validate_on_submit():
        user.set_password(form.password.data)
        db.session.commit()
        flash("Nové heslo bylo nastaveno!", "success")
        return redirect(url_for("public.login"))
    return render_template("public/reset_password.html", form=form)


@public.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("admin.courses"))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is None:
            flash("Špatné heslo!", "danger")
            return redirect(url_for("public.login"))

        if user.check_password(form.password.data):
            login_user(user)
            next = request.args.get("next")
            if next == None or not next[0] == "/":
                next = url_for("public.index")
            return redirect(next)
        else:
            flash("Špatné heslo!", "danger")

    return render_template("public/login.html", form=form)
