// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_VEML6070.h>
#include <Wire.h>
//instantiating the uv sensor
Adafruit_VEML6070 uv = Adafruit_VEML6070();
// test
// assign SETUP button's pin
int button = BTN;
// Setup
void setup() {
    // Setup serial port
    Serial.begin(9600);

    Serial.println("VEML6070 Test");
    //pass in the integration time constant VEML6070_1_T ~125ms
    uv.begin(VEML6070_1_T);
    // Setup pin mode for button
    pinMode(button, INPUT);
    // Setup webhook subscribe
    Particle.subscribe("hook-response/sunsmart", myHandler, MY_DEVICES);
}
// main loop
void loop() {

    Serial.print("UV light level: ");
    Serial.println(uv.readUV());
    // read button and if it is pressed
    if (digitalRead(button) == 0) { // pulldown resistor, 0: Pressed
        // Construct json string
        String data = String("{ \"longitude\": -110.950258, \"latitude\": 32.227698, \"uv\": ");
        String uvdata = String(uv.readUV());
        data = data + uvdata + "}";
        // Log to serial console
        Serial.println("button pressed!");
        // Publish to webhook
        Particle.publish("sunsmart", data, PRIVATE);
    }
    // delay .5 second to block continuous input
    delay(1000);
}
// When obtain response from the publish
void myHandler(const char *event, const char *data) {
  // Formatting output
  String output = String::format("Response from Post:\n  %s\n", data);
  // Log to serial console
  Serial.println(output);
}
