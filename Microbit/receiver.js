//
// https://makecode.microbit.org/_c7acxidDb42M
//
let signalStrength = 0
let serialSend = ""
let Acceleration = 0
let Compass = 0
let LightLevel = 0
let Temperature = 0
radio.onDataPacketReceived( ({ receivedString: itemName, receivedNumber: itemValue }) =>  {
    if (itemName == "lightlevel") {
        LightLevel = itemValue
    } else if (itemName == "compass") {
        Compass = itemValue
    } else if (itemName == "acceleration") {
        Acceleration = itemValue
    } else if (itemName == "temperature") {
        Temperature = itemValue
    }
    serialSend = "{\"lightlevel\": " + LightLevel + "," + "\"compass\":" + Compass + "," + "\"acceleration\":" + Acceleration + "," + "\"temperature\":" + Temperature + "," + "\"signalstrength\":" + signalStrength + "}"
    serial.writeLine(serialSend)
})
Temperature = 0
LightLevel = 0
Acceleration = 0
Compass = 0
radio.setGroup(1)
radio.setTransmitPower(7)
basic.forever(() => {
    if (Compass < 22 || Compass > 337) {
        basic.showArrow(ArrowNames.North)
    } else if (Compass < 67 && Compass > 22) {
        basic.showArrow(ArrowNames.NorthEast)
    } else if (Compass < 112 && Compass > 67) {
        basic.showArrow(ArrowNames.East)
    } else if (Compass < 157 && Compass > 112) {
        basic.showArrow(ArrowNames.SouthEast)
    } else if (Compass < 202 && Compass > 157) {
        basic.showArrow(ArrowNames.South)
    } else if (Compass < 247 && Compass > 202) {
        basic.showArrow(ArrowNames.SouthWest)
    } else if (Compass < 292 && Compass > 247) {
        basic.showArrow(ArrowNames.West)
    } else if (Compass < 337 && Compass > 292) {
        basic.showArrow(ArrowNames.NorthWest)
    }
    signalStrength = radio.receivedSignalStrength()
    radio.sendString("beep")
    basic.pause(500)
})
