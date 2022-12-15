FROM python:3.9-slim

RUN apt-get update && apt-get -y upgrade && apt-get install -y wkhtmltopdf gcc gcc+ python3-dev libevent-dev
RUN apt-get install -y openssl

WORKDIR /app
COPY . /app

RUN pip3 install -U pip
RUN pip3 install --no-cache-dir -r requirements.txt
