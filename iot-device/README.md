# Particle Photon (Wi-Fi)

## How to hook Photon to SunSmart web service.
1. Head to https://console.particle.io/integrations
* Choose NEW INTEGRATION button.
* Choose Webhook.
  - Event Name: `sunsmart`
  - URL: <your own server domain name (ec2)> + /device/post endpoint
    - `http://ec2-ww-xx-yy-zz.us-east-2.compute.amazonaws.com:3000/device/post`
  - Request Type: POST
  - Device: Any
* Select Advanced Setting
  - Choose `JSON`
  - Specify format in textarea
```JSON
{
  "deviceId": "{{PARTICLE_DEVICE_ID}}",
  "longitude": "{{longitude}}",
  "latitude": "{{latitude}}",
  "uv": "{{uv}}",
  "time": "{{PARTICLE_PUBLISHED_AT}}"
}
```
  - Include default data: No
* Press (CREATE WEBHOOK) button.
You can confirm that the webhook is created.
* Flash [the program](https://github.com/BillyTseng/SunSmart/blob/master/iot-device/sunsmartapp.cpp) to the Photon by https://build.particle.io
* Open up localhost's Terminal and type `particle serial monitor` to execute the program.
* Press the setup button on the Photon, and it will send an event to hooked sunsmart service.

### Reference
1. [Particle Photon Webhook Tutorial Part II](https://docs.google.com/document/d/1cD3tdi_Ps40LLq_0d9GJm0a4N-F8_STqD1pKaHS_g7k/edit#heading=h.k8rzbkpi6p3g).
