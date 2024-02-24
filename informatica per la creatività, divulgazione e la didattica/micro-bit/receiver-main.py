from microbit import *
import radio
radio.on()

rxnumber = 1

sleeptime = rxnumber * 750

while True:
    incoming = radio.receive()
    if incoming:
        sleep(sleeptime)
        while True:
            display.scroll(incoming)