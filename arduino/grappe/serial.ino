void serialSetup() {
    Serial.begin(115200);
}

void serialSendData() {
    Serial.println(F("hello"));
}

void serialSendReadyEvent() {
  Serial.println(F("ready-event"));
}

void serialEventAck(bool isAck) {
  if(isAck) {
    Serial.println(F("event-ack"));
  } else {
    Serial.println(F("event-nack"));
  }
}
