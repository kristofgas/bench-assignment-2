using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.RegisterUser
{
    public class RegisterUserCommand : IRequest<int>
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public RegisterUserCommandHandler(IApplicationDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<int> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Email, cancellationToken);
            if (existingUser != null)
            {
                throw new Exception("Username or email already exists");
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            _context.Users.Add(user);

            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == RoleEnum.Admin, cancellationToken);
            if (defaultRole != null)
            {
                _context.UserRoles.Add(new UserRole { User = user, Role = defaultRole });
            }


            await _context.SaveChangesAsync(cancellationToken);

            return user.Id;
        }
    }
}