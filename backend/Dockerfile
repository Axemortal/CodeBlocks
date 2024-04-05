ARG BASE_IMAGE="python"
ARG BASE_TAG="3.10-slim"
FROM ${BASE_IMAGE}:${BASE_TAG}

# Set the working directory to /
WORKDIR /

# Install g++ compiler and related tools
RUN apt-get update && apt-get install -y g++

# Copy only the requirements file first to leverage Docker cache
COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["/bin/bash", "-c", "python -m uvicorn main:app --host 0.0.0.0"]
