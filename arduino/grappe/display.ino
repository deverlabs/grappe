#include <Wire.h>  // Include Wire if you're using I2C
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define PIN_RESET 4
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 // 64, but i don't know why only 32 makes it work : maybe malloc issue -- OLED display height, in pixels

Adafruit_SSD1306 display0(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, PIN_RESET);
Adafruit_SSD1306 display1(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, PIN_RESET);

String displayLabels[4] = "";

void displaysSetup() {
  Wire.begin();

  if(!display0.begin(SSD1306_SWITCHCAPVCC, 0x3D)) {
    //Serial.println(F("SSD1306 allocation failed for display 0"));
    for(;;); // Don't proceed, loop forever
  }
  delay(1000);
  if(!display1.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    //Serial.println(F("SSD1306 allocation failed for display 1"));
    for(;;); // Don't proceed, loop forever
  }

  display0.setRotation(2);
  display1.setRotation(2);
 
  _printLayout();
}

void setLabel(int component, String label) {
  displayLabels[component] = label;

  _printLayout();
}

void _printLayout() {
  display0.clearDisplay();
  display1.clearDisplay();

  display0.setTextSize(1);
  display0.setTextColor(WHITE);
  display0.drawLine(0, (SCREEN_HEIGHT / 2) -2, SCREEN_WIDTH, (SCREEN_HEIGHT / 2) -2, WHITE);
  
  display1.setTextSize(1);
  display1.setTextColor(WHITE);
  display1.drawLine(0, (SCREEN_HEIGHT / 2) -2, SCREEN_WIDTH, (SCREEN_HEIGHT / 2) -2, WHITE);
  
  display0.setCursor(10, 0);
  display0.println("<  " + displayLabels[0]);

  display0.setCursor(10, 20);
  display0.println(">  " + displayLabels[1]);

  display1.setCursor(10, 0);
  display1.println("<  " + displayLabels[2]);

  display1.setCursor(10, 20);
  display1.println(">  " + displayLabels[3]);

  display0.display();
  display1.display(); 
}
