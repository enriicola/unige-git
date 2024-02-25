namespace It.gs.backend.Utilities
{
    using System.Runtime.ExceptionServices;
    using System.Text;
    using System.Text.Json;
    using CSharpFunctionalExtensions;

    public static class ContentExtensions
    {
        public static HttpContent ToContent<T>(this T @this)
        {
            var payload = JsonSerializer.Serialize(@this);
            return new StringContent(payload, Encoding.UTF8, "application/json");
        }

        public static async Task<Result<T>> ReadAs<T>(this HttpResponseMessage @this)
        {
            try
            {
                var responses = await @this.Content.ReadAsStreamAsync();
                return Result.Ok(await JsonSerializer.DeserializeAsync<T>(responses));
            }
            catch (Exception e)
            {
                return Result.Fail<T>(ExceptionDispatchInfo.Capture(e));
            }
        }

        public static async Task<Result<IList<T1>>> Join<T1, T2>(
            this IList<T1> @this,
            Func<T1, Task<HttpResponseMessage>> joinRequest,
            Action<T1, T2> map)
        {
            try
            {
                foreach (var item in @this)
                {
                    var groupsRespo = await joinRequest(item);
                    if (groupsRespo.IsSuccessStatusCode)
                    {
                        var contentString = await groupsRespo.Content.ReadAsStreamAsync();
                        var content = await JsonSerializer.DeserializeAsync<T2>(contentString);
                        map(item, content);
                    }
                }
                return Result.Ok(@this);
            }
            catch (Exception e)
            {
                return Result.Fail<IList<T1>>(ExceptionDispatchInfo.Capture(e));
            }
        }

        public static async Task<Result<IList<T1>>> Join1<T1, T2>(
            this IList<T1> @this,
            Func<T1, Task<T2>> joinRequest,
            Action<T1, T2> map)
        {
            try
            {
                foreach (var item in @this)
                {
                    var groupsRespo = await joinRequest(item);
                    // var content = await JsonSerializer.DeserializeAsync<T2>(groupsRespo);
                    map(item, groupsRespo);
                }
                return Result.Ok(@this);
            }
            catch (Exception e)
            {
                return Result.Fail<IList<T1>>(ExceptionDispatchInfo.Capture(e));
            }
        }
    }
}
