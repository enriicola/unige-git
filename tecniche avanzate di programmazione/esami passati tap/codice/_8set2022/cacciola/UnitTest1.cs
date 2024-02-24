using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography;
using System.Xml.Schema;

namespace Esame_8_9_22
{
    public class Tests
    {
        [Test]
        public void Test1(){
            Func<int, int, int> coFunc1 = (x, y) => x + y;
            IEnumerable<int[]> exp = new[]{
                new int[] { 1 }, new int[] { 1, 1 }, new int[] { 1, 2, 1 }, new int[] { 1, 3, 3, 1 },
                new int[] { 1, 4, 6, 4, 1 }
            };
            Assert.That(ExtraMath.GeneralizedTartaglia(1, coFunc1).Take(5), Is.EqualTo(exp));
        }
        [Test]
        public void Test2()
        {
            try{
                Func<string, string, string> coFunc = delegate(string s, string s1){
                    return (s.Length != 4 && s1.Length != 4) ? s + s1 : throw new MyException("Concat");
                };
                var seed = "X";
                var a = ExtraMath.GeneralizedTartaglia(seed, coFunc).ToArray().Take(6);
            }
            catch (AggregateException aex){
                int i = 0;
                foreach (MyException innerException in aex.InnerExceptions){
                    Console.WriteLine(innerException.Index);
                    Assert.That(innerException.Index, Is.EqualTo(++i));
                }
            }
        }
        [TestCase(0)] // [TestCase(1)] // [TestCase(5)]
        public void Test3(int lineNumber){
            if (lineNumber < 1) Assert.Inconclusive();
            int isCalled = 0;
            Func<int, int, int> coFunc = (x, y) => x + y;
            var a = ExtraMath.GeneralizedTartaglia(1, coFunc).Take(lineNumber);
            foreach (var line in a){
                for (int i = 0; i < line.Length; i++)
                    Console.Write(line[i]);
                var lenght = line.ToArray().Length; 
                if (lenght != 1) isCalled += lenght - 2;
                Console.Write(isCalled);
                Console.WriteLine();
            }
            Assert.That(isCalled, Is.EqualTo(((lineNumber - 1) * (lineNumber - 2)) / 2));
        }
    }
}
