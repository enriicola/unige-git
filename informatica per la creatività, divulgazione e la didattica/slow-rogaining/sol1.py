# 1
import microbit
import radio   
import random                   

radio.on()                      # Turn the Radio on
radio.config(channel = 7)       # Channel default 7

alphabet = [microbit.Image.HAPPY, microbit.Image.SMILE, microbit.Image.SAD]        # Our word of mouth 
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
    
    elif microbit.button_b.is_pressed():                # Check if button B is pressed
        sending = str(myIndex) + str(2)                             # index and counter (index -> word of mouth, counter -> close the ring)
        radio.config(channel = 8)                       # Tuning to channel 8 (sending message to micro:bit 2)
        radio.send(sending)                             # Send the message
        microbit.display.scroll("Sending")          
        microbit.display.show(alphabet[myIndex])
        radio.config(channel = 7)                       # Tuning to channel 7 (ready for receiving messages from micro:bit 3)
        microbit.sleep(125)                             # sleep for debouncing

    elif microbit.accelerometer.was_gesture("shake"):   # 3rd exercise: accelerometer event handler
        microbit.display.clear()
        randomIndex = random.randint(0,2)               # pseudo-random number between 0 and 2
        microbit.display.show(alphabet[randomIndex])
        myIndex = randomIndex
    

    incoming = radio.receive()                          # grab incoming message

    
    if incoming:                                        # if there is a message
        microbit.display.scroll("Receiving")               # Scroll the incoming character
        microbit.display.show(alphabet[int(incoming[0])])     # Return to displaying what we will send
        myIndex = int(incoming[0])
        if int(incoming[1]) > 0:
            index = incoming[0]
            count = str(int(incoming[1]) - 1)
            radio.config(channel = 8)
            incoming = index + count
            radio.send(incoming)
            radio.config(channel = 7)
        else:
            microbit.display.scroll("Ok!") 
       

    microbit.sleep(125)                                 # sleep to save cycles
  
