#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_ADXL343.h>

Adafruit_ADXL343 accel = Adafruit_ADXL343(12345);

#define LED_R_PIN 9
#define LED_G_PIN 10
#define LED_B_PIN 11
#define HALL_PIN A0
#define BUZZER_PIN 6

bool magnetDetected = false;
bool hammerDetected = false;

void playPump() {
  tone(BUZZER_PIN, 1000, 80);
}

void playBroken() {
  tone(BUZZER_PIN, 800, 200);
  delay(250);
  tone(BUZZER_PIN, 500, 200);
  delay(250);
  tone(BUZZER_PIN, 300, 300);
  delay(350);
}

void playHammerHit() {
  tone(BUZZER_PIN, 2500, 50);
}

void playFixed() {
  tone(BUZZER_PIN, 600, 100);
  delay(120);
  tone(BUZZER_PIN, 800, 100);
  delay(120);
  tone(BUZZER_PIN, 1000, 100);
  delay(120);
  tone(BUZZER_PIN, 1400, 200);
}

void playDanger() {
  tone(BUZZER_PIN, 880, 100);
  delay(150);
  tone(BUZZER_PIN, 880, 100);
  delay(150);
  tone(BUZZER_PIN, 880, 100);
}

void setup() {
  Serial.begin(9600);
  pinMode(LED_R_PIN, OUTPUT);
  pinMode(LED_G_PIN, OUTPUT);
  pinMode(LED_B_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  accel.begin();
}

void loop() {
  int hallVal = analogRead(HALL_PIN);
  if (hallVal > 600 && !magnetDetected) {
    magnetDetected = true;
    Serial.println("pump");
    playPump();
  } 
  else if (hallVal <= 600) {
    magnetDetected = false;
  }

  sensors_event_t event;
  accel.getEvent(&event);
  
  float movement = sqrt(
    event.acceleration.x * event.acceleration.x +
    event.acceleration.y * event.acceleration.y +
    event.acceleration.z * event.acceleration.z
  );

  if (movement > 20 && !hammerDetected) {
    hammerDetected = true;
    Serial.println("fix");
    playHammerHit();
  } 
  else if (movement <= 20) {
    hammerDetected = false;
  }

  if (Serial.available()) {
    String incoming = Serial.readStringUntil('\n');
    incoming.trim();

    if (incoming == "broken") {
      playBroken();
    }
    else if (incoming == "fixed") {
      playFixed();
    }
    else if (incoming == "danger") {
      playDanger();
    }
    else {
      int r = incoming.substring(0, incoming.indexOf(',')).toInt();
      incoming = incoming.substring(incoming.indexOf(',') + 1);
      int g = incoming.substring(0, incoming.indexOf(',')).toInt();
      int b = incoming.substring(incoming.indexOf(',') + 1).toInt();
      analogWrite(LED_R_PIN, r);
      analogWrite(LED_G_PIN, g);
      analogWrite(LED_B_PIN, b);
    }
  }

  delay(50);
}