using InfiniteDodgeGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InfiniteDodgeGame.Services
{
    public interface IGameService
    {
        public IList<Player> Players { get; set; }
        public int NumberOfPlayers { get; }
    }
}
