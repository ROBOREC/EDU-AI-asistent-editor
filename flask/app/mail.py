from flask_mail import Message
from threading import Thread
from app import app, mail


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_email(**data):
    bcc = data.get("bcc", [])
    attachments = data.get("attachments", [])
    msg = Message(
        data["subject"],
        sender=(app.config["MAIL_FROM"], app.config["MAIL_USERNAME"]),
        recipients=data["recipients"],
        bcc=bcc,
    )
    msg.body = data.get("text", "")
    msg.html = data.get("html", "")
    for target_filename, attachment in attachments:
        with open(attachment, "rb") as fh:
            msg.attach(
                filename=target_filename,
                disposition="attachment",
                content_type="application/pdf",
                data=fh.read(),
            )
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
