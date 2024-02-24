using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esame_8_9_22
{
    public static class ExtraMath{
        public static IEnumerable<T[]> GeneralizedTartaglia<T> (T seed,Func<T,T,T>generator){
            var exception = new List<Exception>();
            int i = 0;
            T[] pre = new T[1];
            pre[0]= seed;
            while (true){
                yield return pre;
                int size = 2 + i;
                T[] next = new T[size];
                next[0] = seed;
                next[size - 1] = seed;
                    if (i != 0){
                        for (int j = 1; j < size - 1; j++){
                            try{ 
                                var contr = generator(pre[j - 1], pre[j]);
                                next[j] = contr;
                            }
                            catch (MyException e){
                                exception.Add(e);
                            }
                        }
                    }
                    if (exception.Any())
                        throw new AggregateException("Aggregation", exception);
                    pre = next;
                i++;
            }
        }
    }
}
