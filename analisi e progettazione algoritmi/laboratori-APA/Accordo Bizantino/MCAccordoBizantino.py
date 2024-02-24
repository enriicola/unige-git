#MG
import random

results = []
iterations = 10000
HEAD = 1
TAILS = 0
HONESTPROCESS = 3
GlobalCoin = random.randint(0, 1)
Generals = [[],[],[],[]] # list of lists
maj = [] # list
tally = [] # list
GENLENGTH = len(Generals)-1
neededRounds = 0

R = pow(2, 10)

def most_frequent(mylist):
    counter = {}
    for element in mylist:
        if element in counter.keys():
            counter[element]+=1
        else:
            counter[element] = 1
    if counter.get(0) == counter.get(1):
        return random.randint(0,1)
    else:
        return max(counter, key = counter.get)

def main():
   for i in range(iterations):

      for general in Generals:
         general.clear()
      maj.clear()
      tally.clear()

      neededRounds = 0

      while True:
         GlobalCoin = random.randint(0, 1)
         if neededRounds == 0:
               #taking every general's deciosion randomically and transmitting the information to every other general
               for general in range(GENLENGTH):
                  decision = random.randint(0, 1)
                  for otherGeneral in range(GENLENGTH):
                     Generals[otherGeneral].append(decision)

               #setting up the last general's decision for every general (it should be the opposite of the i-th general)
               for general in range(GENLENGTH):
                  Generals[general].append(1-Generals[general][general]) 
         
         #this is the termination's condition, if there is a majority among the generals' decisions
         if Generals[0][0] == Generals[1][1] == Generals[2][2]:
               results.append(neededRounds)
               break

         #setting up maj to rappresent the majority inside the generals' decisions
         #setting up tally to take be the number of times that the maj value shows up
         most_freqElement = 0
         for general in range(GENLENGTH):
               maj.append(most_frequent(Generals[general]))
               tally.append(Generals[general].count(maj[most_freqElement]))
               most_freqElement+=1

         #taking every general's decision based on the majority or on the value of the global coin
         resultingDecisions = []
         for decisions in range(len(tally)):
               if tally[decisions] >= HONESTPROCESS:
                  resultingDecisions.append(maj[decisions])
               elif GlobalCoin == HEAD:
                  resultingDecisions.append(1)
               else:
                  resultingDecisions.append(0)
         
         #resetting the generals with the new values
         for element in Generals:
               element.clear()

         general_i_decision = 0
         for general in range(GENLENGTH):
               decision = resultingDecisions[general_i_decision]
               for otherGeneral in range(GENLENGTH):
                  Generals[otherGeneral].append(decision)
               general_i_decision+=1

         #setting up the last General, the impostor for every general
         for general in range(GENLENGTH):
               Generals[general].append(1-Generals[general][general]) 

         maj.clear()
         tally.clear()
         neededRounds+=1


   print()
   print("N° di round per raggiungere l'accordo:", neededRounds)

   
   print("\nR: ", R)
   print()
main()