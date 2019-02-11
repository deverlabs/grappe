void serialSetup() {
    Serial.begin(115200);
}

void serialSendData() {
    Serial.println(F("hello"));
}

void serialSendReadyEvent() {
  Serial.println(F("0:ready-event"));
}

void serialEventAck(bool isAck) {
  if(isAck) {
    Serial.println(F("0:event-ack"));
  } else {
    Serial.println(F("0:event-nack"));
  }
}

void serialSendChangeEvent(uint8_t slot, uint8_t value) {
  Serial.println("1:" + String(slot) + ":" + String(value));
}
