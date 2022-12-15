FROM rasa/rasa-sdk:2.8.2
ADD requirements.txt .
COPY actions.py actions/actions.py
# Change back to root user to install dependencies
USER root
RUN python3 -m pip install -U pip
RUN python3 -m pip install -r requirements.txt
# By best practices, don't run the code with root user
USER 1001
