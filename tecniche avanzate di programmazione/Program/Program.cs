namespace SUT
{
    public class Customer{
        public DateTime SignUpTime{ get; } //prop+TAB+TAB // qui il set non serve, wishful thinking :)
        public int OrderNumber{ get; set; } // property //set non dovrebbe esistere, dovrebbe ...

        /// <summary>
        /// precalcolare il prezzo di un ordine determinato dal prezzo degli item comprati;
        /// se il prezzo supera 100.00 sconto 3%
        /// se il cliente ha fatto almeno altri 10 ordini sconto 0.5%
        /// se è cliente da almeno 5 anni sconto 10%
        /// </summary>
        /// <returns></returns>
        ///

        public double ExpectedCost(double itemCost){
            var result = itemCost;
            var discount = 0.0;

            if (itemCostn > 100) discount += 3;
            if(OrderNumber>=10) discount += .5;

            return itemCost*(100-discount)/100;

            //return (OrderNumber >= 10) ? itemCost.* 97 * .995 : itemCost * .97;
            //return itemCost/* *.97 */;
        }
    }
}