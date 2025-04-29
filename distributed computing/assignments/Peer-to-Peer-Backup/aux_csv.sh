#!/bin/zsh

for cfg in client_server p2p; do
   for i in {0..10}; do
      echo "\n\n\n ===> Running $cfg config with $i evil nodes ..."
      time /usr/bin/python3 storage.py "$cfg.cfg" --e $i
      if [ $? -ne 0 ]; then
         exit 1
      fi
   done
done

/usr/bin/python3 plot_results.py