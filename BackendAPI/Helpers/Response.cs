namespace BackendAPI.Helpers
{
    public class Response
    {
        public object Data { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public IEnumerable<string> Errors { get; set; }
    }
}
