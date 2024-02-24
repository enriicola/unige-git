from microbit import *
import radio

message = 'Buon Natale :)'

while True:
    if button_a.was_pressed():
        radio.on()
        radio.send(message)
        while True:
            display.scroll(message)