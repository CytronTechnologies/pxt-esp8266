/*******************************************************************************
 * Functions for Blynk
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/



namespace esp8266 {
    // Flag to indicate whether the blynk data was updated successfully.
    let blynkUpdated = false

    // Blynk servers.
    let blynkServers = ["blynk.cloud", "fra1.blynk.cloud", "lon1.blynk.cloud",
                        "ny3.blynk.cloud", "sgp1.blynk.cloud", "blr1.blynk.cloud", "iot.serangkota.go.id"]



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

        // Loop through all the blynk servers.
        for (let i = 0; i < blynkServers.length; i++) {
            // Connect to Blynk.
            if (sendCommand("AT+CIPSTART=\"TCP\",\"" + blynkServers[i] + "\",80", "OK", 5000) == true) {

                // Construct the data to send.
                // http://blynk.cloud/external/api/get?token={token}&{pin}
                let data = "GET /external/api/get?token=" + authToken + "&" + pin + " HTTP/1.1\r\n"

                // Send the data.
                sendCommand("AT+CIPSEND=" + (data.length + 2), "OK")
                sendCommand(data)

                // Verify if "SEND OK" is received.
                if (getResponse("SEND OK", 5000) != "") {

                    // Make sure Blynk response is 200.
                    if (getResponse("HTTP/1.1", 5000).includes("200 OK")) {

                        // Get the pin value.
                        // It should be the last line in the response.
                        while (true) {
                            let response = getResponse("", 200)
                            if (response == "") {
                                break
                            } else {
                                value = response
                            }
                        }

                        // Set the upload successful flag.
                        blynkUpdated = true
                    }
                }
            }

            // Close the connection.
            sendCommand("AT+CIPCLOSE", "OK", 1000)

            // If blynk is updated successfully.
            if (blynkUpdated == true) {
                // Rearrange the Blynk servers array to put the correct server at first location.
                let server = blynkServers[i]
                blynkServers.splice(i, 1)
                blynkServers.unshift(server)

                break
            }

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

        // Loop through all the blynk servers.
        for (let i = 0; i < blynkServers.length; i++) {
            // Connect to Blynk.
            if (sendCommand("AT+CIPSTART=\"TCP\",\"" + blynkServers[i] + "\",80", "OK", 5000) == true) {

                // Construct the data to send.
                // http://blynk.cloud/external/api/update?token={token}&{pin}={value}
                let data = "GET /external/api/update?token=" + authToken + "&" + pin + "=" + formatUrl(value) + " HTTP/1.1\r\n"

                // Send the data.
                sendCommand("AT+CIPSEND=" + (data.length + 2), "OK")
                sendCommand(data)

                // Verify if "SEND OK" is received.
                if (getResponse("SEND OK", 5000) != "") {

                    // Make sure Blynk response is 200.
                    if (getResponse("HTTP/1.1", 5000).includes("200 OK")) {

                        // Get the pin value.
                        // It should be the last line in the response.
                        while (true) {
                            let response = getResponse("", 200)
                            if (response == "") {
                                break
                            } else {
                                value = response
                            }
                        }

                        // Set the upload successful flag.
                        blynkUpdated = true
                    }
                }
            }

            // Close the connection.
            sendCommand("AT+CIPCLOSE", "OK", 1000)

            // If blynk is updated successfully.
            if (blynkUpdated == true) {
                // Rearrange the Blynk servers array to put the correct server at first location.
                let server = blynkServers[i]
                blynkServers.splice(i, 1)
                blynkServers.unshift(server)

                break
            }

        }

        return
    }
}
