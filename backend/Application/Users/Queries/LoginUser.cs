using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Queries.LoginUser
{

    public class LoginUserQuery : IRequest<LoginResult>
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginUserQueryHandler : IRequestHandler<LoginUserQuery, LoginResult>
    {
        private readonly IApplicationDbContext _context;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public LoginUserQueryHandler(IApplicationDbContext context, IJwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<LoginResult> Handle(LoginUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

            if (user == null)
            {
                return new LoginResult { Success = false, Error = "Invalid username or password" };
            }

            var passwordHasher = new PasswordHasher<Domain.Entities.User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return new LoginResult { Success = false, Error = "Invalid username or password" };
            }
            var roles = await _context.UserRoles
    .Where(ur => ur.UserId == user.Id)
    .Select(ur => ur.Role.Name)
    .ToListAsync(cancellationToken);

            var roleEnums = roles.Select(r => (RoleEnum)r).ToList();

            var token = _jwtTokenGenerator.GenerateToken(user, roleEnums);
            return new LoginResult
            {
                Success = true,
                UserId = user.Id,
                Username = user.Username,
                Token = token
            };
        }
    }
}