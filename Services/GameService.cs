using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InfiniteDodgeGame.Models;

namespace InfiniteDodgeGame.Services
{
    public class GameService : IGameService
    {
        public IList<Player> Players { get; set; }
        public int NumberOfPlayers => Players.Count;

        public GameService()
        {
            Players = new List<Player>();
        }
    }
}
