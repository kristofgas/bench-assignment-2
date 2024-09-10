namespace Infrastructure.Options
{
    public class DatabaseOptions
    {
        public const string Key = "Database";
        public string? Name { get; set; }
        public string? Server { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}