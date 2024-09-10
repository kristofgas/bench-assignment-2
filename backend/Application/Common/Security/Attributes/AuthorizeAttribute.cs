using Domain.Enums;

namespace Application.Common.Security.Attributes
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
    public class AuthorizeAttribute : Attribute
    {
        public RoleEnum[] Roles { get; set; } = Array.Empty<RoleEnum>();

        public AuthorizeAttribute(params RoleEnum[] roles)
        {
            Roles = roles;
        }
    }
}