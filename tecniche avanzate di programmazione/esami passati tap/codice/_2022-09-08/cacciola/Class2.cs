using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esame_8_9_22
{
    public class MyException : Exception{
        private static int _count;
        public int Index { get; } = ++_count;
        public MyException(){}
        public MyException(string? message) : base(message){}
        public MyException(string? message, Exception? innerException) : base(message, innerException){}
    }
}
