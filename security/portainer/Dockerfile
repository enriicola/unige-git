FROM ubuntu:latest
# . includes app.py and requirements.txt
COPY . /app
WORKDIR /app
RUN apt-get update
RUN apt-get install -y python3 python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
CMD [ "python3", "app.py" ]
