#include <U8x8lib.h>

#define PIN_RESET 4

U8X8_SSD1306_128X64_ALT0_HW_I2C display0(PIN_RESET);
U8X8_SSD1306_128X64_ALT0_HW_I2C display1(PIN_RESET);

String displayLabels[4] = "";

void displaysSetup() {
  #if ENABLE_DISPLAYS
  display0.setI2CAddress(0x3D * 2);
  display1.setI2CAddress(0x3C * 2);
  display0.begin();
  display1.begin();
  display0.setFlipMode(1);
  display1.setFlipMode(1);
  display0.setPowerSave(0);
  display1.setPowerSave(0);
   
  printLayout();
  #endif
}

void setLabel(int component, String label) {
  label.trim();
  displayLabels[component] = label;

  #if ENABLE_DISPLAYS
    printLayout();
  #endif
}

void displaysPrintSplash() {
  #if ENABLE_DISPLAYS
    display0.clearDisplay();
    display1.clearDisplay();
    
    display1.setFont(u8x8_font_profont29_2x3_f);
    display0.setFont(u8x8_font_open_iconic_check_4x4);

    display1.drawString(0, 0, " grappe");
    display0.drawGlyph(5, 0, 64);
  #endif
}

String _formatRightLabel(String labelOriginal) {
  String label = labelOriginal.substring(0, 14);
  
  while(label.length() < 14) {
    label = ' ' + label;
  }

  label = label + " >";

  return label;
}

void printLayout() {
  display0.clearDisplay();
  display1.clearDisplay();

  display0.setFont(u8x8_font_7x14B_1x2_f);
  display1.setFont(u8x8_font_7x14B_1x2_f);

  String labelLeft;
  String labelRight;

  // Display 0 - Bottom
  labelLeft = "< " + displayLabels[0];
  labelRight = _formatRightLabel(displayLabels[1]);
  display0.drawString(0, 0, labelLeft.c_str());
  display0.drawString(0, 6, labelRight.c_str());

  // Display 1 - Top
  labelLeft = "< " + displayLabels[2];
  labelRight = _formatRightLabel(displayLabels[3]);
  display1.drawString(0, 0, labelLeft.c_str());
  display1.drawString(0, 6, labelRight.c_str());
}
