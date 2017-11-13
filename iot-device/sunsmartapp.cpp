// assign SETUP button's pin
int button = BTN;
// Setup
void setup() {
    // Setup serial port
    Serial.begin(9600);
    // Setup pin mode for button
    pinMode(button, INPUT);
    // Setup webhook subscribe
    Particle.subscribe("hook-response/holz", myHandler, MY_DEVICES);
}
// main loop
void loop() {
    // read button and if it is pressed
    if (digitalRead(button) == 0) { // pulldown resistor, 0: Pressed
        // Construct json string
        String data = String("{ \"longitude\": -110.954099, \"latitude\": 32.234999 }");
        // Log to serial console
        Serial.println("button pressed!");
        // Publish to webhook
        Particle.publish("holz", data, PRIVATE);
    }
    // delay .5 second to block continuous input
    delay(500);
}
// When obtain response from the publish
void myHandler(const char *event, const char *data) {
  // Formatting output
  String output = String::format("Response from Post:\n  %s\n", data);
  // Log to serial console
  Serial.println(output);
}
