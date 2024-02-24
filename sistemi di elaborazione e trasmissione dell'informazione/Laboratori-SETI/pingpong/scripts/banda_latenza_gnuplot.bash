#!/bin/bash
if [[ $# != 0 ]]; then
	printf "\nError: Didn't expected parameters\n\n";
	exit 1;
fi

set -e
#The -e option is used to enable echo's interpretation
	#of additional instances of the newline character as 
	#well as the interpretation of other special characters,
	#such as a horizontal tab, which is represented by \t.

#raccolgo i dati dai rispettivi file sia per tcp che per udp
declare -a protocol=("tcp" "udp")
declare  N1
declare  N2
declare  Th_n1
declare  Th_n2

#ciclo for "doppio" per le operazioni ripetute sia per tcp che per udp
for index in "${protocol[@]}"
do
    #ottengo msg_size e throughput medio sia per head che tail;
    N1=$(head -n 1 ../data/"${index}"_throughput.dat | cut -d ' ' -f1) #cut -d ' ' -fn è come se fosse "l'indice" dell'array
    N2=$(tail -n 1 ../data/"${index}"_throughput.dat | cut -d ' ' -f1)

    Th_n1=$(head -n 1 ../data/"${index}"_throughput.dat | cut -d ' ' -f3)
    Th_n2=$(tail -n 1 ../data/"${index}"_throughput.dat | cut -d ' ' -f3)

    echo  
    echo ----"$index"----
    echo Size Min: "$N1" 
    echo Size Max: "$N2"
    echo Throughput Min: "$Th_n1"
    echo Throughput Max: "$Th_n2"


    #tramite la formula inversa (Delay = msg_size/T) calcolo delay_min e delay_max
    declare delay_min
    declare delay_max
    delay_min=$(bc <<<"scale=10; msg_size=${N1}; t=${Th_n1}; msg_size/t")
    delay_max=$(bc <<<"scale=10; msg_size=${N2}; t=${Th_n2}; msg_size/t")

    echo Delay Min: "$delay_min"
    echo Delay Max: "$delay_max"

    #tramite le formule di aulaweb calcolo latency0 e band_width
    #band_width = (N2 - N1) / ( D(N2) - D(N1) ); 
    declare band_width 
    declare latency0
    band_width=$(bc <<<"scale=10; n2=${N2}; n1=${N1}; dmin=${delay_min}; dmax=${delay_max}; ((n2-n1)/(dmax-dmin))")
    latency0=$(bc <<< "scale=10; n2=${N2}; n1=${N1}; dmin=${delay_min}; dmax=${delay_max}; ( (dmin*n2) - (dman*n1) ) / (n2-n1)")
    
    echo Banda: "$band_width"
    echo Latenza 0: "$latency0"


    #se trovo grafici vecchi, li sovrascrivo
    if test -f "${index}_banda_latenza.png"; then
        rm "${index}_banda_latenza.png"
    fi

    #creo il nuovo grafico
    gnuplot <<-eNDgNUPLOTcOMMAND
        set term png size 900, 700 
        set output "../data/${index}_banda_latenza.png"
        set logscale y 10
        set logscale x 2
        set xlabel "msg size (B)"
        set ylabel "throughput (KB/s)"
        lbf(x) = x / ($latency0 + x / $band_width)
        plot "../data/${index}_throughput.dat" using 1:2 title "${index} ping-pong average Throughput" \
            with linespoints, \
        lbf(x) title "Latency-Bandwidth model with L=${latency0} and B=${band_width}" \
            with linespoints
        clear
eNDgNUPLOTcOMMAND
#...or simply don't indent the end token:

done
xdg-open ../data/throughput.png 
xdg-open ../data/tcp_banda_latenza.png
xdg-open ../data/udp_banda_latenza.png