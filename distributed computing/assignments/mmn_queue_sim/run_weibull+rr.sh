

echo "\n📦 Installing the required packages..."
pip install matplotlib argparse  

brew ls imagemagick > /dev/null || brew install imagemagick
if [ $? -ne 0 ]; then
   echo "❌ Error: Failed to install imagemagick."
   exit
fi


for i in 1 2 5 10
do
    echo "\n🚀 Running mmn  simulation with d equals to " $i " ..."
    /usr/bin/python3 u_mmn_queue_rr.py -t --n 1000 --max-t 100000 --d $i -e --shape 0.5
    cp mmn.png tmp_$i.png
done

magick tmp_1.png tmp_2.png +append tmp1.png
magick tmp_5.png tmp_10.png +append tmp2.png
magick tmp1.png tmp2.png -append result_mmn.png
rm tmp*.png
mv result_mmn.png result_rr_weibull.png
