# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV FLASK_ENV production
ENV FLASK_RUN_PORT 8080
ENV TIM_API_KEY AIzaSyDW5PLFS8Gn5U_kYBTxBmJdWuYX-XTPNAM
ENV TEQUILA_API_KEY s8cqRUKtsdhRjy1Ty8jK9gq2r3Ecxz06
ENV UNSPLASH_ACCESS_KEY WwuWD3UHYpGHWFrks64U__Y-s7saYAoavLxDLkUSDDc
ENV UNSPLASH_SECRET_KEY dvp34D_UUGMeAyBInpeBkBNAytHG6Hx_KY0xSdaE3f4
ENV REDIS_PASS STQXNJPSwOWyKPT9WiaDtBCk8hmJvvfr
ENV REDIS_HOST redis-13815.c304.europe-west1-2.gce.cloud.redislabs.com
ENV REDIS_PORT 13815

# Run app.py when the container launches
CMD ["python", "app/index.py"]