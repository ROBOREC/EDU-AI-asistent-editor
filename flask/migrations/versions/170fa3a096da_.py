"""empty message

Revision ID: 170fa3a096da
Revises: 0f0f4543bd50
Create Date: 2022-06-16 00:10:02.227530

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '170fa3a096da'
down_revision = '0f0f4543bd50'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('taskset_id', table_name='celery_tasksetmeta')
    op.drop_table('celery_tasksetmeta')
    op.drop_index('task_id', table_name='celery_taskmeta')
    op.drop_table('celery_taskmeta')
    op.add_column('courses', sa.Column('user_id', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('courses', 'user_id')
    op.create_table('celery_taskmeta',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('task_id', mysql.VARCHAR(length=155), nullable=True),
    sa.Column('status', mysql.VARCHAR(length=50), nullable=True),
    sa.Column('result', sa.BLOB(), nullable=True),
    sa.Column('date_done', mysql.DATETIME(), nullable=True),
    sa.Column('traceback', mysql.TEXT(), nullable=True),
    sa.Column('name', mysql.VARCHAR(length=155), nullable=True),
    sa.Column('args', sa.BLOB(), nullable=True),
    sa.Column('kwargs', sa.BLOB(), nullable=True),
    sa.Column('worker', mysql.VARCHAR(length=155), nullable=True),
    sa.Column('retries', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('queue', mysql.VARCHAR(length=155), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('task_id', 'celery_taskmeta', ['task_id'], unique=False)
    op.create_table('celery_tasksetmeta',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('taskset_id', mysql.VARCHAR(length=155), nullable=True),
    sa.Column('result', sa.BLOB(), nullable=True),
    sa.Column('date_done', mysql.DATETIME(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('taskset_id', 'celery_tasksetmeta', ['taskset_id'], unique=False)
    # ### end Alembic commands ###
