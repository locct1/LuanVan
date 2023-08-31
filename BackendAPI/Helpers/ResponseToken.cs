namespace BackendAPI.Helpers
{
    public class ResponseToken
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string AccessToken { get; set; }
        public IEnumerable<string> Errors { get; set; }

    }
}
