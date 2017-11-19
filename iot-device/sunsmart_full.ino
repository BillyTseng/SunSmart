// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_GPS.h>


#define GPSSerial Serial1

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
    String format = "{ \"longitude\": %f, \"latitude\": %f, \"uv\": %d }";
    String longitudeString = "-1";
    String latitudeString = "-1";
    String uvString = "-1";
    String response = sprintf(format, longitude, latitude, uv);
   

    char c = GPS.read();
    // if you want to debug, this is a good time to do it!
    if (GPSECHO)
        if (c) Serial.print(c);
    // if a sentence is received, we can check the checksum, parse it...
    if (GPS.newNMEAreceived()) {
        // a tricky thing here is if we print the NMEA sentence, or data
        // we end up not listening and catching other sentences!
        // so be very wary if using OUTPUT_ALLDATA and trytng to print out data
        Serial.println(GPS.lastNMEA()); // this also sets the newNMEAreceived() flag to false
        if (!GPS.parse(GPS.lastNMEA())) // this also sets the newNMEAreceived() flag to false
          return; // we can fail to parse a sentence in which case we should just wait for another
      }
    // if millis() or timer wraps around, we'll just reset it
    if (timer > millis()) timer = millis();
         
    // approximately every 2 seconds or so, print out the current stats
    if (millis() - timer > 2000) {
        timer = millis(); // reset the timer
        Serial.print("\nTime: ");
        Serial.print(GPS.hour, DEC); Serial.print(':');
        Serial.print(GPS.minute, DEC); Serial.print(':');
        Serial.print(GPS.seconds, DEC); Serial.print('.');
        Serial.println(GPS.milliseconds);
        Serial.print("Date: ");
        Serial.print(GPS.day, DEC); Serial.print('/');
        Serial.print(GPS.month, DEC); Serial.print("/20");
        Serial.println(GPS.year, DEC);
        Serial.print("Fix: "); Serial.print((int)GPS.fix);
        Serial.print(" quality: "); Serial.println((int)GPS.fixquality);
        if (GPS.fix) {
            Serial.print("Location: ");
            Serial.print(GPS.latitude, 4); Serial.print(GPS.lat);
            Serial.print(", ");
            Serial.print(GPS.longitude, 4); Serial.println(GPS.lon);
            Serial.print("Speed (knots): "); Serial.println(GPS.speed);
            Serial.print("Angle: "); Serial.println(GPS.angle);
            Serial.print("Altitude: "); Serial.println(GPS.altitude);
            Serial.print("Satellites: "); Serial.println((int)GPS.satellites);
        }
    
    
        if (digitalRead(button) == 0) { // pulldown resistor, 0: Pressed
            uvString = String(uv.readUV());
            // Construct json string
            
            
          //  String data = String("{ \"longitude\": -110.950258, \"latitude\": 32.227698, \"uv\": 222 }");
    
            String data1 = String("{ \"longitude\": ");
            String data2 = String(", \"latitude\": ");
            String data3 = String(", \"uv\": 222 }");
            String latitude = String(GPS.latitude);
            latitudeString = String(GPS.latitude);
            longitudeString = String(GPS.longitude);
            String longitude = String(GPS.longitude);
            String data = data1 + longitude + data2 + latitude + data3;
            // Log to serial console
            
            Serial.println(data);
            Serial.println("button pressed!");
            // Publish to webhook
    //        Particle.publish("sunsmart", data, PRIVATE);
        }
    
    }
    response = sprintf(format, longitude, latitude, uv);
    Particle.publish("sunsmart", response, PRIVATE)
    delay(500);
}
// When obtain response from the publish
void myHandler(const char *event, const char *data) {
    // Formatting output
    String output = String::format("Response from Post:\n  %s\n", data);
    // Log to serial console
    Serial.println(output);
}
