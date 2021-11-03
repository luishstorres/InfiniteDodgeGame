using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InfiniteDodgeGame.Models
{
    public class Player
    {
        public (int Y, int X) Position { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Score { get; set; }
        public int PlayerNumber { get; set; }
    }
}
