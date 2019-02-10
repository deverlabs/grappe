
void setup() {
    serialSetup();
    displaysSetup();

    delay(1000);
}

void loop() {
  serialSendData();

  

  delay(1000);

  setLabel(0, "Prout");

  delay(1000);
}
