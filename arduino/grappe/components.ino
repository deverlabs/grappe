#include "components.h"

/** NOTE THIS PROJECT IS SHIT */

uint8_t slots[4] = {T_COMP_NULL};

/* To be changed, because for testing we assume we only have 1 value per component */
uint8_t values[4] = {0};

void componentPlug(uint8_t type, uint8_t slot) {
  slots[slot] = type;

  switch(type) {
    case T_COMP_NULL:
      break;

    case T_COMP_PUSHBTN:
      pinMode(SLOT0_DIGITAL_1, INPUT);
      break;
  }
}

bool componentPollValues(uint8_t slot) {
  bool hasChanged = false;
  switch(slots[slot]) {
    case T_COMP_NULL:
      break;

    case T_COMP_PUSHBTN:
      uint8_t old = values[slot];
      values[slot] = digitalRead(SLOT0_DIGITAL_1);
      if(values[slot] != old) { hasChanged = true; }
      break;

    default:
      break;
  }

  return hasChanged;
}

uint8_t componentLastValue(uint8_t slot) {
  return values[slot];
}
