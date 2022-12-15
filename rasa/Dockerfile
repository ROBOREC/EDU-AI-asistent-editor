FROM rasa/rasa:2.8.5
ADD requirements.txt .
USER root
RUN python3 -m pip install -U pip
RUN python3 -m pip install -r requirements.txt
# By best practices, don't run the code with root user
#USER 1001
