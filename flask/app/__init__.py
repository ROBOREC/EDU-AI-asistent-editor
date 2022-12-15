import os
import uuid
from flask import Flask, request, redirect
from flask_login import LoginManager
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from flask_cors import CORS

app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", str(uuid.uuid4()))
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["UPLOAD_FOLDER"] = "./app/static/uploads/"

app.config[
    "SQLALCHEMY_DATABASE_URI"
] = f"mysql+pymysql://root:{os.environ.get('MYSQL_ROOT_PASSWORD', '')}@mysql/edu?charset=utf8mb4"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_COOKIE_DOMAIN"] = False
app.config["JSON_SORT_KEYS"] = False

db = SQLAlchemy(app)
Migrate(app, db)

mail_settings = {
    "MAIL_SERVER": os.environ.get("MAIL_SERVER", ""),
    "MAIL_PORT": os.environ.get("MAIL_PORT", 465),
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_FROM": os.environ.get("MAIL_FROM", ""),
    "MAIL_USERNAME": os.environ.get("MAIL_USERNAME", ""),
    "MAIL_PASSWORD": os.environ.get("MAIL_PASSWORD", ""),
    "MAIL_DEBUG": False,
    "MAIL_SUPPRESS_SEND": False,
}
app.config.update(mail_settings)

mail = Mail(app)


@app.context_processor
def inject_env_variables():
    return dict(
        PROJECT_URL=os.environ.get("PROJECT_URL", "FILL_PROJECT_URL"),
        LIBRARY_URL=os.environ.get("LIBRARY_URL", "FILL_LIBRARY_URL"),
    )


@app.before_first_request
def create_tables():
    db.create_all()


# login config
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "public.login"
login_manager.login_message = "Přihlaste se prosím"
login_manager.login_message_category = "warning"

# blueprints
from app.public.views import public
from app.admin.views import admin

app.register_blueprint(public)
app.register_blueprint(admin, url_prefix="/admin")


@app.errorhandler(404)
def resource_not_found(e):
    # try roborec.chat static files
    if "/static/uploads" in request.path:
        return redirect("https://roborec.chat" + request.path)
    return "404"
