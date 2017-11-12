# SunSmart
The SunSmart application is an IoT enabled web application for monitoring the amount of sun exposure a user receives.

## Prerequisites
### Get third party API key.
* Head to [weatherbit.io](https://www.weatherbit.io/api) get API key
* Replace `YOUR_API_KEY` with API keys in `iot-server/3rd-party-apikeys`.

### Install mongodb
1. `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5`
2. `echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/testing multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list`
3. `sudo apt-get update`
4. `sudo apt-get install -y mongodb-org`
5. `sudo service mongod start`

## Usage
1. `sudo npm install express-generator -g`
2. `git clone` this project to AWS.
3. `cd SunSmart/iot-server/`
4. `npm install`
5. `npm install request mongoose`
6. `npm start`
