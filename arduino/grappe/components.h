#define SLOTS_TOTAL 6

#define T_COMP_NULL 0
#define T_COMP_PUSHBTN 1
#define T_COMP_DSWITCH 2
#define T_COMP_POTENTIOMETER 3
#define T_COMP_JOYSTICK 4
#define T_COMP_PIR 5

#define POTENTIOMETER_THRESHOLD 2

#define JOYSTICK_CENTER 515
#define JOYSTICK_THRESHOLD 10

#ifndef COMPONENTS_H
#define COMPONENTS_H

/**
 * Define I/O pins for each slots.
 * Use 0 if pin is not used (ie connected to VCC) (care to analog0 !)
 * For left components, pins are ordered from bot to top.
 * For right components, pins are ordered from top to bot.
 * Refer to the hardware datasheet, some pins are ANALOG.
 * 
 * Access values : pgm_read_byte(&SLOTS_PINS[slot][pin])
 * Example : pgm_read_byte(&SLOTS_PINS[0][0]) returns 4
 */
const byte SLOTS_PINS[][5] PROGMEM = {
  {4, 0, 5}, // D4, 0, D5
  {2, 0, 3}, // D2, 0, D3
  {7, 0, 7}, // D7, 0, A7
  {6, 0, 6}, // D6, 0, A6
  {12, 0, 1, 0, 0}, // D12, A0, A1, VCC, GND
  {11, 0, 0, 0, 0} // D11
};

#endif
