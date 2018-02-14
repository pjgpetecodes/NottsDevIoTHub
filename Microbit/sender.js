//
// https://makecode.microbit.org/_JubLWd1kzL0s
//
let Temperature = 0
let Acceleration = 0
let Compass = 0
let Light_Level = 0
let signalStrength = 100
let timeSinceLastPing = 0

radio.setGroup(1)
radio.setTransmitPower(7)

radio.onDataPacketReceived(({ receivedString }) => {
    if (receivedString == "beep") {
        signalStrength = radio.receivedSignalStrength()
        signalStrength *= -1
        timeSinceLastPing = 0;
    }
})

basic.forever(() => {
    Light_Level = input.lightLevel()
    Compass = input.compassHeading()
    Acceleration = input.acceleration(Dimension.X)
    Temperature = input.temperature()
    radio.sendValue("lightlevel", Light_Level)
    basic.pause(30)
    radio.sendValue("compass", Compass)
    basic.pause(30)
    radio.sendValue("acceleration", Acceleration)
    basic.pause(30)
    radio.sendValue("temperature", Temperature)
    basic.pause(30)
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
    basic.pause(500)

    timeSinceLastPing += 1

})
control.inBackground(() => {
    basic.forever(() => {

        //
        // If we've not recieved a ping in more than 2secs then default the signal strength to 100, 
        // which stops the beep
        //
        if (timeSinceLastPing > 3) {
            signalStrength = 100
        }

        if (signalStrength < 50) {
            music.playTone(523, music.beat(BeatFraction.Sixteenth))
            basic.pause(100)
        } else if (signalStrength < 60) {
            music.playTone(523, music.beat(BeatFraction.Sixteenth))
            basic.pause(250)
        } else if (signalStrength < 70) {
            music.playTone(523, music.beat(BeatFraction.Sixteenth))
            basic.pause(500)
        } else if (signalStrength < 80) {
            music.playTone(523, music.beat(BeatFraction.Sixteenth))
            basic.pause(750)
        } else if (signalStrength < 90) {
            music.playTone(523, music.beat(BeatFraction.Sixteenth))
            basic.pause(1000)
        } else {
            // Do nothing
        }

    })
})
