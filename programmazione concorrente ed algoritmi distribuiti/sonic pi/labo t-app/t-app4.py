# Team_4825087
from psonic import *
from threading import Thread, Condition

def cymbal():
    while True:
        sample(DRUM_CYMBAL_CLOSED)
        sleep(0.5)

def snare():
    while True:
        sleep(1)
        sample(DRUM_SNARE_HARD)
        sleep(2)
        sample(DRUM_SNARE_HARD)
        sleep(0.5)

def bass():
    while True:
        sample(DRUM_BASS_HARD)
        sleep(1.25)
        sample(DRUM_BASS_HARD)
        sleep(0.75)
        sample(DRUM_BASS_HARD)
        sleep(0.75)
        sample(DRUM_BASS_HARD)
        sleep(1.25)

cymbal_thread = Thread(target=cymbal)
snare_thread = Thread(target=snare)
bass_thread = Thread(target=bass)

cymbal_thread.start()
snare_thread.start()
bass_thread.start()

cymbal_thread.join()
snare_thread.join()
bass_thread.join()

input("Press enter to continue...") 