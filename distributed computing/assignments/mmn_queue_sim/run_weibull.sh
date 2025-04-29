

echo "\n📦 Installing the required packages..."
pip install matplotlib argparse > /dev/null
if [ $? -ne 0 ]; then
   echo "❌ Error: Failed to install the required python packages."
   exit
fi

brew ls imagemagick > /dev/null || brew install imagemagick
if [ $? -ne 0 ]; then
   echo "❌ Error: Failed to install imagemagick."
   exit
fi

for i in 1 2 5 10
do
    echo "\n🚀 Running mmn  simulation with d equals to " $i " ..."
    /usr/bin/python3 u_mmn_queue.py -t --n 1000 --max-t 100000 --d $i --shape 0.5
    cp mmn.png tmp_$i.png
done

magick tmp_1.png tmp_2.png +append tmp1w.png
magick tmp_5.png tmp_10.png +append tmp2w.png
magick tmp1w.png tmp2w.png -append result_weibull.png
# rm tmp*.png

# merge weibull vertically
magick tmp_1.png tmp_2.png -append tmp1wv.png
magick tmp_5.png tmp_10.png -append tmp2wv.png
magick tmp1wv.png tmp2wv.png -append result_weibull_vertical.png
rm tmp*.png
