from celery import Celery
from celery.signals import task_postrun
import requests
import pymysql
import os

# Initialize Celery
celery = Celery(
    "worker",
    broker="amqp://rabbit",
    backend=f"db+mysql+pymysql://root:{os.environ.get('MYSQL_ROOT_PASSWORD', '')}@mysql/edu",
)

celery.conf.update(result_extended=True)


def get_db_all(sql, parameters):
    connection = pymysql.connect(
        host="mysql",
        user="root",
        password=os.environ.get("MYSQL_ROOT_PASSWORD", ""),
        database="edu",
        autocommit=True,
        cursorclass=pymysql.cursors.DictCursor,
    )
    cursor = connection.cursor()
    cursor.execute(sql, parameters)
    result = cursor.fetchall()
    connection.close()
    return result


def get_db_row(sql, parameters):
    connection = pymysql.connect(
        host="mysql",
        user="root",
        password=os.environ.get("MYSQL_ROOT_PASSWORD", ""),
        database="edu",
        autocommit=True,
        cursorclass=pymysql.cursors.DictCursor,
    )
    cursor = connection.cursor()
    cursor.execute(sql, parameters)
    result = cursor.fetchone()
    connection.close()
    return result


@celery.task(name="actions.celery_app.trigger_intent", bind=True)
def trigger_intent(self, data):
    requests.post(
        f"""{os.getenv('RASA_URL', '')}/conversations/{data["sender_id"]}/trigger_intent?output_channel=latest""",
        headers={"Content-Type": "application/json"},
        json={
            "name": "EXTERNAL_reminder",
        },
    )
    return "OK"


@task_postrun.connect
def task_postrun_handler(sender=None, **kwargs):
    get_db_row(
        "update planned_tasks set is_finished = 1 where sender_id = %s and task_id = %s",
        [kwargs["args"][0]["sender_id"], kwargs["task_id"]],
    )
