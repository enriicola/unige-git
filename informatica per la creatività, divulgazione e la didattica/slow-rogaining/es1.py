# GRUPPO 1
import microbit
import radio                     
import random

radio.on()                      # Turn the Radio on
radio.config(channel = 7)       # Channel default 7

alphabet = [microbit.Image.HAPPY, microbit.Image.HEART, microbit.Image.SAD]        # Our word of mouth 
myIndex = 0                                                                        # Initialise the index variable.

flag = True                                                                        # a flag variable for the broadcast loop

while flag:                                                                        # Broadcast loop: if button a is pressed, it sends the message "synch" to all other microbit tuned to channel 20. Then set flag to False and exit the loop
    microbit.display.show("BROADCAST")
    if microbit.button_a.is_pressed():
      radio.config(channel = 20)
      code = 123
      message = str(code)                                                        # type casting (from int to string): radio.send() sends only string data.
      radio.send(message)
      flag = False
      radio.config(channel = 7)


# main event loop
while True: 
    microbit.display.show(alphabet[myIndex]) 
    if microbit.button_a.is_pressed():                  # Check if button A is pressed
        myIndex = myIndex + 1                           # If it is advance the Alphabet index
        if myIndex > len(alphabet) - 1:                 # Check if alphIndex is still in range
            myIndex = 0;                                # Reset index to zero
        microbit.display.show(alphabet[myIndex])        # Display Indexed Image 
        microbit.sleep(125)                             # sleep 125ms
    
    if microbit.button_b.is_pressed():                # Check if button B is pressed
      pass
      # completare



    incoming = radio.receive()                          # grab incoming message

    
    if incoming:                                        # if there is a message
        microbit.display.scroll("Receiving")               # Scroll the incoming character
        pass
        # completare
       

    microbit.sleep(125)                                 # sleep to save cycles
  
