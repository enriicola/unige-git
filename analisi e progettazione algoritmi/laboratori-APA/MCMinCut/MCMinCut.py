from random import choice
import math
# Genera il grafo di Fritsch (che trovi nelle note) con 9 vertici e 21 archi e 
# verifica la frequenza empirica ^p con la quale ottieni un taglio minimo applicando 
# MCMinCut 10^5 volte. --- Utilizza ^p per calcolare il numero di run R necessari per 
# ottenere il taglio minimo con una probabilità del 99,9%

def my_print(g, i=0):
	print("")
	for key, value in g.items():
		print(str(key)+'\t -->  ', str(value))
	print("") # for just one blank new line :)

def merge_vertices(g,u,v,l):
   ulist=g[u]+g[v]
   ulist.remove(u)
   ulist.remove(v)
   g.pop(u)
   g.pop(v)
   g[u+v]=ulist
   for k, val in g.items():
      if u in val or v in val:
            g[k] = [x if x!=u and x!=v else u+v for x in val]
#sistemo grafo
   for k, val in g.items():
      new_list = []
      for item in val:
         if k not in item :
            new_list.append(item)
      g[k] = new_list

def main():
	#conto elementi
	n_run = 100000
	my_list = []

	#creazione del grafo
	for _ in range(n_run):
		graph = {
					"A" : ["B", "C","D","H","I"],
					"B" : ["C", "E", "A","G","I"],
					"C" : ["A","B","D","E"],
					"D" : ["C", "A","H","F","E"],
					"E" : ["B", "C","G","F","D"],
					"F" : ["D", "E","H","G","I"],
					"G" : ["I", "F","E","B"],
					"H" : ["I", "D","F","A"],
					"I" : ["B", "A","H","G","F"]
		}
		#applico MCMinCut
		while len(graph)>2:
			u = choice(list(graph.keys()))
			v = choice(graph[u])
			merge_vertices(graph,u,v,list)
			n = 0
			for k, val in graph.items():
				n = len(val)
			my_list.append(n)

	#calcolo delle occorrenze e della frequenza empirica
	occurrencies = {}
	for y in my_list:
		if y in occurrencies:
			occurrencies[y]+=1
		else:
			occurrencies[y] = 1

	my_print(occurrencies)
	print("Il taglio minimo è ", min(occurrencies.keys()))
	p = occurrencies[min(occurrencies.keys())]/n_run
	print("La frequenza empirica è ", p)
	
	n_run_min = -7/(math.log(1-p))

	# print("test: ", math.modf(n_run_min))
	print("Il numero di run per calcolare il taglio minimo con la probabilità del 99,9% è ", math.ceil(n_run_min),"\n")
main()