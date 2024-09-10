using Application.Common.Exceptions.Enums;

namespace Application.Common.Exceptions
{
    public class CommandErrorCodeException : Exception
    {
        public IDictionary<string, string[]> CommandErrorCodes = new Dictionary<string, string[]>();

        public CommandErrorCodeException(CommandErrorCode errorCode, string? parameter = null, string? message = null) : base(message ?? "One or more errors have occurred.")
        {
            CommandErrorCodes.Add(errorCode.ToString(), parameter != null ? new string[] { parameter } : Array.Empty<string>());
        }

        public CommandErrorCodeException(CommandErrorCode errorCode, string[] parameters, string? message = null) : base(message ?? "One or more errors have occurred.")
        {
            CommandErrorCodes.Add(errorCode.ToString(), parameters);
        }

        public CommandErrorCodeException(IEnumerable<KeyValuePair<CommandErrorCode, string[]>> errorCodes, string? message = null) : base(message ?? "One or more errors have occurred.")
        {
            foreach (var errorCodeGroup in errorCodes.GroupBy(x => x.Key))
            {
                CommandErrorCodes.Add(errorCodeGroup.Key.ToString(), errorCodeGroup.SelectMany(y => y.Value).Distinct().ToArray());
            }
        }
    }
}