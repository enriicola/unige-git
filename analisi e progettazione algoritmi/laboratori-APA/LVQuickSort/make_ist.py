import matplotlib.pyplot as plt
import numpy as np

# prendo il valore atteso
e = open('espettazione.dat', 'r')

e.seek(0)
exp = int(e.readline())

# prendo i confronti
f = open('comparison.dat', 'r')

# creerò un unico file con 50 bin
binCounts = [50]

# ciclo da 1 a 50
for binCount in binCounts:
	values = []
	f.seek(0)

	# riempo values
	for line in f.readlines():
		values.append(int(line))

	n, bins, patches = plt.hist(values, bins=binCount)

	# guardo dove si trova il valore di espettazione
	# mi fermo quando l'espettazione è nel bin giusto
	# bins[0] limite sx del primo bin; bin[1] limite destro
	# per questo parto a contare da count=-1, poiché se ad esempio mi trovassi
	# nel primo bin entrerebbe nell'if una volta (perché è maggiore del limite sx di esso)
	# alla fine count dovrebbe essere 0
	count = -1;
	for mayExp in bins:
		if(exp > mayExp):
			count = count + 1

	plt.gca().set(title='Istogramma LVQuicksort', xlabel='Numero di Confronti', ylabel='Frequenza')
	plt.savefig(f'Istogramma.png')
	plt.close()