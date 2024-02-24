import matplotlib.pyplot as plt
import numpy as np

f = open('output.txt', 'r')
lines=f.readlines()

numBin = [30]

for binCount in numBin:
   val = []
   f.seek(0)
   for x in range(1, 100):  #parto dal secondo valore perchè il primo è la traccia effettiva
      val.append(int(lines[x]))

   #dopo aver creato l'array contenente i valori vado a creare l'istogramma
   N, bins, patches = plt.hist(val, bins=binCount, edgecolor='grey')

   plt.axvline(x=int(lines[0]), label='Traccia effettiva', c='r')
   plt.axvline(x=int(lines[101]), label='Traccia - Varianza', c='y')
   plt.axvline(x=int(lines[102]), label='Traccia + Varianza', c='g')

   plt.xticks(np.arange(min(val), max(val), 8000.0))
   plt.gca().set(title='MCTrace con M=5', xlabel='Tracce', ylabel='Frequenza')
   plt.savefig(f'5M.png')
   plt.close()


for binCount in numBin:
   val = []
   f.seek(0)
   for x in range(103, 202):
      val.append(int(lines[x]))

   N, bins, patches = plt.hist(val, bins=binCount, edgecolor='grey')

   plt.axvline(x=int(lines[0]), label='Traccia effettiva', c='r')
   plt.axvline(x=int(lines[203]), label='Traccia - Varianza', c='y')
   plt.axvline(x=int(lines[204]), label='Traccia + Varianza', c='g')

   plt.xticks(np.arange(min(val), max(val), 6000.0))
   plt.gca().set(title='MCTrace con M=10', xlabel='Tracce', ylabel='Frequenza')
   plt.savefig(f'10M.png')
   plt.close()


for binCount in numBin:
   val = []
   f.seek(0)
   for x in range(205, 304):
      val.append(int(lines[x]))

   N, bins, patches = plt.hist(val, bins=binCount, edgecolor='grey')

   plt.axvline(x=int(lines[0]), label='Traccia effettiva', c='r')
   plt.axvline(x=int(lines[305]), label='Traccia - Varianza', c='y')
   plt.axvline(x=int(lines[306]), label='Traccia + Varianza', c='g')

   plt.xticks(np.arange(min(val), max(val), 5000.0))
   plt.gca().set(title='MCTrace con M=25', xlabel='Tracce', ylabel='Frequenza')
   plt.savefig(f'25M.png')
   plt.close()


for binCount in numBin:
   val = []
   f.seek(0)
   for x in range(307, 406):
      val.append(int(lines[x]))

   N, bins, patches = plt.hist(val, bins=binCount, edgecolor='grey')

   plt.axvline(x=int(lines[0]), label='Traccia effettiva', c='r')
   plt.axvline(x=int(lines[407]), label='Traccia - Varianza', c='y')
   plt.axvline(x=int(lines[408]), label='Traccia + Varianza', c='g')

   plt.xticks(np.arange(min(val), max(val), 2000.0))
   plt.gca().set(title='MCTrace con M=100', xlabel='Tracce', ylabel='Frequenza')
   plt.savefig(f'100M.png')
   plt.close()