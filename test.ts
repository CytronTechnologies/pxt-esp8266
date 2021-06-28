const TX_PIN = SerialPin.P16
const RX_PIN = SerialPin.P15
const BAUDRATE = BaudRate.BaudRate115200

const WIFI_SSID = "my_ssid"
const WIFI_PWD = "my_password"

const THINGSPEAK_WRITE_API_KEY = "my_write_api_key"
const BLYNK_TOKEN = "my_blynk_token"

const TIMEZONE = 8



// Initialize the ESP8266 module.
// Show sad face if failed.
esp8266.init(TX_PIN, RX_PIN, BAUDRATE)
if (!esp8266.isESP8266Initialized()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Connect to WiFi router.
// Show sad face if failed.
esp8266.connectWiFi(WIFI_SSID, WIFI_PWD)
if (!esp8266.isWifiConnected()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Upload data to Thingspeak.
// Show sad face if failed.
esp8266.uploadThingspeak(THINGSPEAK_WRITE_API_KEY, 0, 1, 2, 3, 4, 5, 6, 7)
if (!esp8266.isThingspeakUploaded()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Write to Blynk.
// Show sad face if failed.
esp8266.writeBlynk(BLYNK_TOKEN, "V0", "100")
if (!esp8266.isBlynkUpdated()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Read from Blynk and show the value.
// Show sad face if failed.
let value = esp8266.readBlynk(BLYNK_TOKEN, "V0")
if (!esp8266.isBlynkUpdated()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
} else {
    basic.showString(value)
    basic.pause(1000)
}

// Initialize internet time.
// Show sad face if failed.
esp8266.initInternetTime(TIMEZONE)
if (!esp8266.isInternetTimeInitialized()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Update the internet time and show the time.
// Show sad face if failed.
esp8266.updateInternetTime()
if (!esp8266.isInternetTimeUpdated()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
} else {
    basic.showString(esp8266.getHour() + ":" + esp8266.getMinute() + ":" + esp8266.getSecond())
}

