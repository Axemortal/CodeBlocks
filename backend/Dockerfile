ARG BASE_IMAGE="python"
ARG BASE_TAG="3.10-slim"
FROM ${BASE_IMAGE}:${BASE_TAG}

# Set the working directory to /
WORKDIR /

# Install system dependencies (Arduino CLI, wget, others)
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    libzbar-dev \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Install Arduino CLI
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

# Install ESP32 Core
RUN arduino-cli config init
RUN arduino-cli core update-index
RUN arduino-cli core install esp32:esp32

# Install SparkFun Library
ARG ESP32Dir="/root/.arduino15/packages/esp32/hardware/esp32/2.0.11/libraries"
RUN wget https://github.com/sparkfun/SparkFun_TB6612FNG_Arduino_Library/archive/refs/heads/master.zip -O  ${ESP32Dir}/SparkFun_TB6612FNG_Arduino_Library.zip
RUN unzip ${ESP32Dir}/SparkFun_TB6612FNG_Arduino_Library.zip -d ${ESP32Dir}/
RUN rm  ${ESP32Dir}/SparkFun_TB6612FNG_Arduino_Library.zip
RUN mv ${ESP32Dir}/SparkFun_TB6612FNG_Arduino_Library-master  ${ESP32Dir}/SparkFun_TB6612

# Copy only the requirements file first to leverage Docker cache
COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["/bin/bash", "-c", "python -m uvicorn main:app --host 0.0.0.0"]
