using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace InfiniteDodgeGame.Pages
{
    public class ChatModel : PageModel
    {
        private readonly ILogger<ChatModel> _logger;

        public ChatModel(ILogger<ChatModel> logger)
        {
            _logger = logger;
        }
        public void OnGet()
        {
        }
    }
}
