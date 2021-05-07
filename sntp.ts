/*******************************************************************************
 * Functions for Simple Network Time Protocol.
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// NTP server.
const NTP_SERVER_URL = "pool.ntp.org"

namespace esp8266 {
    // Flag to indicate whether the SNTP time is updated successfully.
    let internetTimeUpdated = false

    // Time and date.
    let year = 0, month = 0, day = 0, weekday = 0, hour = 0, minute = 0, second = 0



    /**
     * Return the year.
     */
    //% subcategory="Internet Time"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_get_year
    //% block="year"
    export function getYear(): number {
        return year
    }

    /**
     * Return the month.
     */
    //% subcategory="Internet Time"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_get_month
    //% block="month"
    export function getMonth(): number {
        return month
    }

    /**
     * Return the day.
     */
    //% subcategory="Internet Time"
    //% weight=28
    //% blockGap=8
    //% blockId=esp8266_get_day
    //% block="day"
    export function getDay(): number {
        return day
    }

    /**
     * Return the day of week.
     */
    //% subcategory="Internet Time"
    //% weight=27
    //% blockGap=8
    //% blockId=esp8266_get_weekday
    //% block="day of week"
    export function getWeekday(): number {
        return weekday
    }

    /**
     * Return the hour.
     */
    //% subcategory="Internet Time"
    //% weight=26
    //% blockGap=8
    //% blockId=esp8266_get_hour
    //% block="hour"
    export function getHour(): number {
        return hour
    }

    /**
     * Return the minute.
     */
    //% subcategory="Internet Time"
    //% weight=25
    //% blockGap=8
    //% blockId=esp8266_get_minute
    //% block="minute"
    export function getMinute(): number {
        return minute
    }

    /**
     * Return the second.
     */
    //% subcategory="Internet Time"
    //% weight=24
    //% blockGap=40
    //% blockId=esp8266_get_second
    //% block="second"
    export function getSecond(): number {
        return second
    }



    /**
     * Return true if the internet time is updated successfully.
     */
    //% subcategory="Internet Time"
    //% weight=23
    //% blockGap=8
    //% blockId=esp8266_is_internet_time_updated
    //% block="internet time updated"
    export function isInternetTimeUpdated(): boolean {
        return internetTimeUpdated
    }



    /**
     * Update the internet time.
     * @param timezone Timezone. eg: 8
     */
    //% subcategory="Internet Time"
    //% weight=22
    //% blockGap=8
    //% blockId=esp8266_update_internet_time
    //% block="update internet time at timezone %timezone"
    //% timezone.min=-11 timezone.max=13
    export function updateInternetTime(timezone: number) {
        // Reset the flag.
        internetTimeUpdated = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Enable the SNTP and set the timezone. Return if failed.
        if (sendCommand("AT+CIPSNTPCFG=1," + timezone + ",\"" + NTP_SERVER_URL + "\"", "OK", 500) == false) return

        // Get the time.
        sendCommand("AT+CIPSNTPTIME?")
        let response = getResponse("+CIPSNTPTIME:", 500)
        if (response == "") return

        // Fill up the time and date accordingly.
        response = response.slice(response.indexOf(":") + 1)
        let responseArray = response.split(" ")

        // Day of week.
        switch (responseArray[0]) {
            case "Mon": weekday = 1; break
            case "Tue": weekday = 2; break
            case "Wed": weekday = 3; break
            case "Thu": weekday = 4; break
            case "Fri": weekday = 5; break
            case "Sat": weekday = 6; break
            case "Sun": weekday = 7; break
        }

        // Month.
        switch (responseArray[1]) {
            case "Jan": month = 1; break
            case "Feb": month = 2; break
            case "Mar": month = 3; break
            case "Apr": month = 4; break
            case "May": month = 5; break
            case "Jun": month = 6; break
            case "Jul": month = 7; break
            case "Aug": month = 8; break
            case "Sep": month = 9; break
            case "Oct": month = 10; break
            case "Nov": month = 11; break
            case "Dec": month = 12; break
        }

        // Day.
        day = parseInt(responseArray[2])

        // Time.
        let timeArray = responseArray[3].split(":")
        hour = parseInt(timeArray[0])
        minute = parseInt(timeArray[1])
        second = parseInt(timeArray[2])

        // Year.
        year = parseInt(responseArray[4])



        // Wait until OK is received.
        if (getResponse("OK") == "") return


        internetTimeUpdated = true
        return
    }
}
