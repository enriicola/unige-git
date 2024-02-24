from psonic import *
from threading import Thread
def my_loop():
  play(60)
sleep(1)
1
def looper():
  while True:
    my_loop()
looper_thread = Thread(name=’looper’, target=looper)
looper_thread.start()
input("Press Enter to continue...")
