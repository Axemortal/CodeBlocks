#include <WiFi.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <SparkFun_TB6612.h>

const char* ssid = "Europa";
const char* password = "codeblocks";

// Motor pins
#define PWMA 33
#define AIN2 25
#define AIN1 26
#define STBY 27
#define BIN1 14
#define BIN2 12
#define PWMB 13

// Ultrasonic pins
#define trigPin 35
#define echoPin 32

// Buzzer pins
#define buzzPin 34
unsigned long previousMillis = 0; // will store last time LED was updated
const long interval = 1000; // interval at which to blink (milliseconds)
int repeatState = LOW; // ledState used to set the LEDo

// these constants are used to allow you to make your motor configuration 
// line up with function names like forward.  Value can be 1 or -1
const int offsetR = -1;
const int offsetL = -1;

// Motor init
// Initializing motors.  The library will allow you to initialize as many
// motors as you have memory for.  If you are using functions like forward
// that take 2 motors as arguements you can either write new functions or
// call the function more than once.
Motor motorR = Motor(AIN1, AIN2, PWMA, offsetR, STBY);
Motor motorL = Motor(BIN1, BIN2, PWMB, offsetL, STBY);

// Ultrasonic init
float duration, distance;

void move_forward() {
  update();
  forward(motorL, motorR, 100);
  delay(1000);
  brake(motorL, motorR);
}
  
void move_back() {
  update();
  back(motorL, motorR, 100);
  delay(1000);
  brake(motorL, motorR);
}

void turn_left() {
  update();
  left(motorL, motorR, 100);
  delay(1000);
  brake(motorL, motorR);
}

void turn_right() {
  update();
  right(motorL, motorR, 100);
  delay(1000);
  brake(motorL, motorR);
}

void quack() {
  update();
  tone(buzzPin, 1000);
  delay(1000);
  noTone(buzzPin);
}

void update() {
  // Listen for OTA updates
  ArduinoOTA.handle();
  // Update distance (cm)
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distance = (duration*.0343)/2;
    Serial.print("Distance: ");
    Serial.println(distance);

  // TODO: Update clap

}


void setup() {
  // OTA setup
  Serial.begin(115200);
  Serial.println("Booting");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Connection Failed! Rebooting...");
    delay(5000);
    ESP.restart();
  }

  // Port defaults to 3232
  // ArduinoOTA.setPort(3232);

  // Hostname defaults to esp3232-[MAC]
  // ArduinoOTA.setHostname("myesp32");

  // No authentication by default
  // ArduinoOTA.setPassword("admin");

  // Password can be set with it's md5 value as well
  // MD5(admin) = 21232f297a57a5a743894a0e4a801fc3
  // ArduinoOTA.setPasswordHash("21232f297a57a5a743894a0e4a801fc3");

  ArduinoOTA
    .onStart([]() {
      String type;
      if (ArduinoOTA.getCommand() == U_FLASH)
        type = "sketch";
      else // U_SPIFFS
        type = "filesystem";

      // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
      Serial.println("Start updating " + type);
    })
    .onEnd([]() {
      Serial.println("\nEnd");
    })
    .onProgress([](unsigned int progress, unsigned int total) {
      Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
    })
    .onError([](ota_error_t error) {
      Serial.printf("Error[%u]: ", error);
      if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
      else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
      else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
      else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
      else if (error == OTA_END_ERROR) Serial.println("End Failed");
    });

  ArduinoOTA.begin();

  Serial.println("Ready");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Ultrasonic setup

  // Buzzer setup
  pinMode(buzzPin, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  // ***
  // BLOCK CODE HERE
  // ***
  quack();

}

void loop() {
  ArduinoOTA.handle();
  //Here is the LED blinking section
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
  // save the last time you blinked the LED
  previousMillis = currentMillis;
  // if the LED is off turn it on and vice-versa:
  repeatState = not(repeatState);

  digitalWrite(LED_BUILTIN, repeatState);
  // set the LED with the ledState of the variable:
  }
  
}