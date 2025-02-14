# Base Image
FROM python:3.12

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set working directory
WORKDIR /app

# Copy files into the container
COPY . /app/

# Install dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev
RUN pip install --upgrade pip
COPY ./requirements.txt /app/
RUN pip install -r requirements.txt

# Command to run Django server
#CMD ["sh", "./start.sh"]
