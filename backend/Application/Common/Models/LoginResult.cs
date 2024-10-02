namespace Application.Common.Models
{
    public class LoginResult
    {
        public bool Success { get; set; }
        public string? Error { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
    }
}