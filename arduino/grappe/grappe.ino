
#include "components.h"

String eventString = "";         // a String to hold incoming data
bool eventReceived = false;  // whether the string is complete

#define EVENT_SET_LABEL 1
#define ENABLE_DISPLAYS true

void setup() {
    serialSetup();
    displaysSetup();

    setLabel(0, F("Grappe"));
    setLabel(1, F("Loading"));
    delay(1000);
    setLabel(1, F(""));
    setLabel(0, F(""));

    serialSendReadyEvent();

    
    componentPlug(T_COMP_DSWITCH, 0);
    componentPlug(T_COMP_PUSHBTN, 1);
    //componentPlug(T_COMP_POTENTIOMETER, 2);
    //componentPlug(T_COMP_POTENTIOMETER, 3);
    componentPlug(T_COMP_JOYSTICK, 4);
    //componentPlug(T_COMP_PIR, 5);
}

void loop() {
  //serialSendData();

  /** Event Received from PC **/
  if (eventReceived) {
    processEventReceived();
    
    // clear the string:
    eventString = "";
    eventReceived = false;
  }

  /** Poll Values **/
  for(uint8_t i = 0; i < SLOTS_TOTAL; i++) {
    if(componentPollValues(i)) {
      serialSendChangeEvent(i, componentLastValue(i));
    }
  }

  delay(100);
}

String getValue(String data, char separator, int index)
{
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

void processEventReceived() { 
  switch(getValue(eventString, ':', 0).toInt()) {
    case EVENT_SET_LABEL:
      setLabel(getValue(eventString, ':', 1).toInt(), getValue(eventString, ':', 2));
      serialEventAck(true);
      break;
    default:
      serialEventAck(false);
    break;
  }
}

void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    eventString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      eventReceived = true;
    }
  }
}
