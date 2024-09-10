using Application.Common.Security.Attributes;
using MediatR;
using Shouldly;
using System.Reflection;
using Xunit;

namespace Application.UnitTests.Common.Attributes
{
    public class IAuthAttributeTests
    {
        [Fact]
        public void CommandAndQueries_ShouldHaveAnIAuthAttribute()
        {
            var authAttributeType = typeof(IAuthAttribute);

            var commandsAndQueriesTypes = authAttributeType.Assembly.GetTypes()
              .Where(type => type.GetInterfaces().Any(i =>
                i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IRequest<>)));

            var commandsAndQueriesMissingAuthorizationAttribute = commandsAndQueriesTypes.Where(x =>
              !x.GetCustomAttributes().Any(x => x.GetType().GetInterfaces().Contains(typeof(IAuthAttribute))))
              .Select(x => x.Name);

            commandsAndQueriesMissingAuthorizationAttribute.ShouldBeEmpty();
        }
    }
}
