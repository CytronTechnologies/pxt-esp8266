/*******************************************************************************
 * Functions for ThingSpeak
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// ThingSpeak API url.
const THINGSPEAK_API_URL = "api.thingspeak.com"

namespace esp8266 {
    // Flag to indicate whether the data was uploaded to ThingSpeak successfully.
    let thingspeakUploaded = false



    /**
     * Return true if data is uploaded to ThingSpeak successfully.
     */
    //% subcategory="ThingSpeak"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_thingspeak_data_uploaded
    //% block="ThingSpeak data uploaded"
    export function isThingspeakUploaded(): boolean {
        return thingspeakUploaded
    }



    /**
     * Upload data to ThingSpeak (Data can only be updated to Thingspeak every 15 seconds).
     * @param writeApiKey ThingSpeak Write API Key.
     * @param field1 Data for Field 1.
     * @param field2 Data for Field 2.
     * @param field3 Data for Field 3.
     * @param field4 Data for Field 4.
     * @param field5 Data for Field 5.
     * @param field6 Data for Field 6.
     * @param field7 Data for Field 7.
     * @param field8 Data for Field 8.
     */
    //% subcategory="ThingSpeak"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_upload_thingspeak
    //% block="Upload data to ThingSpeak|Write API key %writeApiKey|Field 1 %field1||Field 2 %field2|Field 3 %field3|Field 4 %field4|Field 5 %field5|Field 6 %field6|Field 7 %field7|Field 8 %field8"
    export function uploadThingspeak(   writeApiKey: string,
                                        field1: number,
                                        field2: number = null,
                                        field3: number = null,
                                        field4: number = null,
                                        field5: number = null,
                                        field6: number = null,
                                        field7: number = null,
                                        field8: number = null  ) {

        // Reset the upload successful flag.
        thingspeakUploaded = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to ThingSpeak. Return if failed.
        if (sendCommand("AT+CIPSTART=\"TCP\",\"" + THINGSPEAK_API_URL + "\",80", "OK", 10000) == false) return

        // Construct the data to send.
        let data = "GET /update?api_key=" + writeApiKey + "&field1=" + field1
        if (field2 != null) data += "&field2=" + field2
        if (field2 != null) data += "&field3=" + field3
        if (field2 != null) data += "&field4=" + field4
        if (field2 != null) data += "&field5=" + field5
        if (field2 != null) data += "&field6=" + field6
        if (field2 != null) data += "&field7=" + field7
        if (field2 != null) data += "&field8=" + field8

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)
        
        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") return
        
        // Check the response from ThingSpeak.
        let response = getResponse("+IPD", 1000)
        if (response == "") return

        // Trim the response to get the upload count.
        response = response.slice(response.indexOf(":") + 1, response.indexOf("CLOSED"))
        let uploadCount = parseInt(response)

        // Return if upload count is 0.
        if (uploadCount == 0) return

        // Set the upload successful flag and return.
        thingspeakUploaded = true
        return
    }
}
