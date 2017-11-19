// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_GPS.h>

#include <Adafruit_VEML6070.h>
#include <Wire.h>
//instantiating the uv sensor

#define GPSSerial Serial1

Adafruit_VEML6070 uv = Adafruit_VEML6070();
// Connect to the GPS on the hardware port
Adafruit_GPS GPS(&GPSSerial);
     
// Set GPSECHO to 'false' to turn off echoing the GPS data to the Serial console
// Set to 'true' if you want to debug and listen to the raw GPS sentences
#define GPSECHO false

uint32_t timer = millis();
// assign SETUP button's pin
int button = BTN;
// Setup
void setup() {
    // Setup serial port
    Serial.begin(9600);
    // Setup pin mode for button
    pinMode(button, INPUT);
    // Setup webhook subscribe

    
    Serial.println("VEML6070 Test");
    //pass in the integration time constant VEML6070_1_T ~125ms
    uv.begin(VEML6070_1_T);
    // Setup pin mode for button
    pinMode(button, INPUT);
    
    
    GPS.begin(9600);
    GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);  
    GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);
    GPS.sendCommand(PGCMD_ANTENNA);
    delay(1000);
    GPSSerial.println(PMTK_Q_RELEASE);
    
    Particle.subscribe("hook-response/sunsmart", myHandler, MY_DEVICES);
}
// main loop
void loop() {
    String format = "{ \"longitude\": %s, \"latitude\": %s, \"uv\": %d }";
    String longitudeString = "-1";
    String latitudeString = "-1";
    String uvString = "-1";
    String response = sprintf(format, longitude, latitude, uv);
   

    char c = GPS.read();
         
    // approximately every 2 seconds or so, print out the current stats
    if (millis() - timer > 2000) {
                        
    }
    if (digitalRead(button) == 0) { 
        String uvString = String(uv.readUV());
        String latitudeString = (GPS.latitude);
        String longitudeString = (GPS.longitude); 
        response = sprintf(format, longitudeString, latitudeString, uvString);
        Serial.println(response);
        Particle.publish("sunsmart", response, PRIVATE);
    }
    delay(1000);
}
// When obtain response from the publish
void myHandler(const char *event, const char *data) {
    // Formatting output
    String output = String::format("Response from Post:\n  %s\n", data);
    // Log to serial console
    Serial.println(output);
}
