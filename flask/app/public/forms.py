from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import (
    StringField,
    PasswordField,
    SubmitField,
    BooleanField,
    FloatField,
    TextAreaField,
    IntegerField,
    SelectField,
)
from wtforms.validators import DataRequired, Email, EqualTo, Optional, Length
from wtforms import ValidationError
from flask_login import current_user
from app.models import User
from flask import request


class LoginForm(FlaskForm):
    email = StringField("E-mail", validators=[DataRequired(), Email()])
    password = PasswordField("Heslo", validators=[DataRequired()])
    submit = SubmitField("Přihlásit se")


class ResetPasswordRequestForm(FlaskForm):
    email = StringField("E-mail", validators=[DataRequired(), Email()])
    submit = SubmitField("Odeslat požadavek")


class ResetPasswordForm(FlaskForm):
    password = PasswordField("Heslo", validators=[DataRequired()])
    password2 = PasswordField(
        "Opakování hesla", validators=[DataRequired(), EqualTo("password")]
    )
    submit = SubmitField("Potvrdit")


class RegistrationForm(FlaskForm):
    def check_email(self, field):
        if User.query.filter_by(email=field.data).first():
            raise ValidationError("Email je zabraný!")

    name = StringField("Jméno a příjmení", validators=[Length(max=50)])
    email = StringField(
        "E-mail", validators=[DataRequired(), Email(), check_email, Length(max=64)]
    )
    password = PasswordField(
        "Heslo",
        validators=[
            DataRequired(),
            EqualTo("pass_confirm", message="Hesla se musí shodovat!"),
        ],
    )
    pass_confirm = PasswordField("Potvrďte heslo", validators=[DataRequired()])
    submit = SubmitField("Registrovat")
