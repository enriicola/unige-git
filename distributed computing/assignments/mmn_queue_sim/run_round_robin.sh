

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
    /usr/bin/python3 u_mmn_queue_rr.py -t --n 1000 --max-t 100000 --d $i -e
    cp mmn.png tmp_$i.png
done

magick tmp_1.png tmp_2.png +append tmp1rr.png
magick tmp_5.png tmp_10.png +append tmp2rr.png
magick tmp1rr.png tmp2rr.png -append result_rr_only.png
# rm tmp*.png


# merge rr vertically
magick tmp_1.png tmp_2.png -append tmp1rrv.png
magick tmp_5.png tmp_10.png -append tmp2rrv.png
magick tmp1rrv.png tmp2rrv.png -append result_rr_vertical.png
rm tmp*.png