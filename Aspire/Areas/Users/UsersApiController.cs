using System;
using System.Threading.Tasks;
using Aspire.Areas.Users.Models;
using Aspire.Areas.Users.Services.Interfaces;
using Aspire.Authentication.Models;
using Aspire.Users.Authentication;
using Aspire.Users.Models;
using Microsoft.AspNetCore.Mvc;

namespace Aspire.Authentication
{
    public class UsersApiController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly IUserService _userService;

        public UsersApiController(
            IAuthorizationService authorizationService,
            IUserService userService)
        {
            _authorizationService = authorizationService;
            _userService = userService;
        }

        [HttpGet]
        [Route("/api/users/usernameAndEmailAvailabile")]
        public async Task<ActionResult> UsernameAndEmailAvailable(string username, string email)
        {
            return Ok(await _userService.GetUsernameAvailability(username));
        }
       
        [HttpPost]
        [Route("/api/users/create")]
        public async Task<ActionResult> CreateUser([FromBody]User user)
        {
            return Ok(await _userService.CreateUser(user));
        }

        [HttpPost]
        [Route("/api/users/authenticate")]
        public async Task<ActionResult> Authenticate([FromBody]AuthenticationRequest request)
        {
            var authenticationSuccess = await _authorizationService.AuthenticateUser(request.Username, request.Password);

            if (authenticationSuccess)
            {
                var user = await _userService.GetUser(request.Username);

                return Ok(new
                {
                    user,
                    //JWT
                    jwt = new AspireJwt
                    {
                        Username = user.Username,
                        Expiration = DateTime.UtcNow.AddHours(4)
                    },
                    success = true
                });
            }

            return BadRequest(new
            {
                success = false
            });
        }

        [HttpGet]
        [Route("/api/users/profile")]
        public async Task<ActionResult> GetUserProfile([FromHeader]string username)
        {
            return Ok(await _userService.GetUser(username));
        }

        [HttpGet]
        [Route("/api/users/authenticatetoken")]
        public async Task<ActionResult> AuthenticateToken([FromHeader]string username, [FromHeader]string expirationDate)
        {
            /*
                This endpoint represents trying to retrieve a user profile based off
                a Json Web Token. If the Json Web Token is valid, we return a successful
                login result (the same as if we had just logged in fresh) with the exception
                that the Json Web Token has the same expiration as the incoming token.
                We don't want to refresh the expiration date on a Json Web Token.
             */

            var expiration = DateTime.Parse(expirationDate);

            if(username != null && expiration > DateTime.Now)
            {
                return Ok(new
                {
                    //user = JsonConvert.SerializeObject(await _userService.GetUser(username)),
                    user = await _userService.GetUser(username),
                    jwt = new AspireJwt
                    {
                        Username = username,
                        Expiration = expiration
                    },
                    success = true
                });
            }

            return BadRequest(new { success = false });
        }

        [HttpPut]
        [Route("/api/users/updateLogin")]
        public async Task<ActionResult> UpdateLoginInfo([FromBody]UpdateLoginInfo request)
        {
            request.OldPassword = "";

            return Ok(await _userService.UpdateUserLoginInfo(request));
        }

        [HttpPut]
        [Route("/api/users")]
        public async Task<ActionResult> UpdateUser([FromBody] User user)
        {
            return Ok(await _userService.UpdateUser(user));
        }
    }

    public class AspireJwt
    {
        public string Username { get; set; }
        public DateTime Expiration { get; set; }
    }
}
