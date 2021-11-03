using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InfiniteDodgeGame.Models;
using InfiniteDodgeGame.Pages;
using InfiniteDodgeGame.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace InfiniteDodgeGame.Hubs
{
    public class GameHub : Hub
    {
        private readonly IGameService _gameService;

        private readonly ILogger<GameHub> _logger;

        public GameHub(IGameService gameService, ILogger<GameHub> logger)
        {
            _gameService = gameService;
            _logger = logger;
        }

        //public IList<Player> Players;
        //public int NumberOfPlayers => Players.Count;

        public async Task LoadPlayerCharacter(string posX, string posY)
        {
            var player = AddPlayer();
            await Clients.All.SendAsync("ReceiveNewPlayer", player.Id.ToString(), _gameService.NumberOfPlayers);
        }

        public async Task MovePlayer(string playerId, string direction)
        {

            var player = _gameService.Players.Where(x => x.Id.ToString().Equals(playerId))?.FirstOrDefault();
            //var id = player.Id.ToString();

            _logger.LogInformation($"PlayerId: {playerId} | PlayerNumber: {player.PlayerNumber}");

            if (direction.Equals("up"))
                await Clients.All.SendAsync("UpdatePlayer", playerId, "MoveUp");

            //if (direction.Equals("s"))
            //    await Clients.All.SendAsync("MoveDown", playerId);

            if (direction.Equals("left"))
                await Clients.All.SendAsync("UpdatePlayer", playerId, "MoveLeft");

            if (direction.Equals("right"))
                await Clients.All.SendAsync("UpdatePlayer", playerId, "MoveRight");

            if (direction.Equals("turn"))
                await Clients.All.SendAsync("UpdatePlayer", playerId, "Turn");

        }

        private Player AddPlayer()
        {
            Player newPlayer = new Player
            {
                Position = GenerateRandomPosition(),
                Id = Guid.NewGuid(),
                Name = $"{DateTime.Now.Millisecond}",
                Score = 0,
                PlayerNumber = _gameService.NumberOfPlayers + 1
            };

            _gameService.Players.Add(newPlayer);
            return newPlayer;
        }

        private (int x, int y) GenerateRandomPosition()
        {
            return (new Random().Next(700), new Random().Next(390));
        }
    }
}
