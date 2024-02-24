# Team_4825087
# -----example----------------------------------------
# def my_loop():
#   play(60)
#   sleep(1)

# def looper():
#   while True:
#     my_loop()
# looper_thread = Thread(name=’looper’, target=looper)
# looper_thread.start()
# input("Press Enter to continue...")

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
        sleep(1.5)
        sample(DRUM_BASS_HARD)
        sleep(0.5)
        sample(DRUM_BASS_HARD)
        sleep(1.5)

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

    