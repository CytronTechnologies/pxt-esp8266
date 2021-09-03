/*******************************************************************************
 * Functions for Blynk
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// Blynk API url.
const BLYNK_API_URL = "blynk-cloud.com"

namespace esp8266 {
    // Flag to indicate whether the blynk data was updated successfully.
    let blynkUpdated = false



    /**
     * Return true if Blynk data was updated successfully.
     */
    //% subcategory="Blynk"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_blynk_data_updated
    //% block="Blynk updated"
    export function isBlynkUpdated(): boolean {
        return blynkUpdated
    }



    /**
     * Read from Blynk and return the pin value as string.
     * @param authToken Blynk's authentification token.
     * @param pin Pin we want to read.
     */
    //% subcategory="Blynk"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_read_blynk
    //% block="read Blynk: Token %authToken Pin %pin"
    export function readBlynk(authToken: string, pin: string): string {
        let value = ""

        // Reset the upload successful flag.
        blynkUpdated = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return value

        // Connect to ThingSpeak. Return if failed.
        if (sendCommand("AT+CIPSTART=\"TCP\",\"" + BLYNK_API_URL + "\",80", "OK", 10000) == false) {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return value
        }

        // Construct the data to send.
        let data = "GET /" + authToken + "/get/" + pin + " HTTP/1.1\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2), "OK")
        sendCommand(data)
        
        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 10000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return value
        }

        // Return if Blynk response is not 200.
        if (getResponse("HTTP/1.1 200 OK", 10000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return value
        }

        // Get the pin value.
        let response = getResponse("[\"", 200)
        value = response.slice(response.indexOf("[\"") + 2, response.indexOf("\"]"))

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        // Make sure the value is not empty.
        if (value != "") {
            blynkUpdated = true
        }
        return value
    }



    /**
     * Write to Blynk.
     * @param authToken Blynk's authentification token.
     * @param pin Write to this pin.
     * @param value Value of the pin.
     */
    //% subcategory="Blynk"
    //% weight=28
    //% blockGap=8
    //% blockId=esp8266_write_blynk
    //% block="write Blynk: Token %authToken Pin %pin Value %value"
    export function writeBlynk(authToken: string, pin: string, value: string) {

        // Reset the upload successful flag.
        blynkUpdated = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to ThingSpeak. Return if failed.
        if (sendCommand("AT+CIPSTART=\"TCP\",\"" + BLYNK_API_URL + "\",80", "OK", 10000) == false) {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Construct the data to send.
        let data = "GET /" + authToken + "/update/" + pin + "?value=" + formatUrl(value) + " HTTP/1.1\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)
        
        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 10000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Return if Blynk response is not 200.
        if (getResponse("HTTP/1.1 200 OK", 10000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        blynkUpdated = true
        return
    }
}
