namespace It.gs.backend.Utilities
{
    using CSharpFunctionalExtensions;
    using It.gs.Repository.Model;

    public static class ResultExtensions
    {
        public static T Unwrap<T>(this Result<IExecuteResult> @this)
        {
            if (@this.IsFailure) { throw new InvalidOperationException("You're trying to unwrap a faulted result!"); }
            var resultValue = @this.Value.Value;
            if (resultValue is T tValue)
            {
                return tValue;
            }
            throw new InvalidOperationException($"You're trying to unwrap an object of type {resultValue?.GetType().FullName} into a instance of {typeof(T).FullName}");
        }
    }
}
