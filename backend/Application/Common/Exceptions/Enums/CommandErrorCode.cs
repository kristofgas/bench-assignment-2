namespace Application.Common.Exceptions.Enums
{
    public enum CommandErrorCode
    {
        /// <summary>
        /// This region of error codes are the default of FluentValdation
        /// </summary>
        #region
        AspNetCoreCompatibleEmailValidator,
        EmailValidator,
        GreaterThanOrEqualValidator,
        GreaterThanValidator,
        LengthValidator,
        MinimumLengthValidator,
        MaximumLengthValidator,
        LessThanOrEqualValidator,
        LessThanValidator,
        NotEmptyValidator,
        NotEqualValidator,
        NotNullValidator,
        PredicateValidator,
        AsyncPredicateValidator,
        RegularExpressionValidator,
        EqualValidator,
        ExactLengthValidator,
        InclusiveBetweenValidator,
        ExclusiveBetweenValidator,
        CreditCardValidator,
        ScalePrecisionValidator,
        EmptyValidator,
        NullValidator,
        EnumValidator,
        #endregion
        //Feel free to add more error codes below.
        //DO NOT ASSIGN VALUES TO THESE AS IT WILL CAUSE NSWAG ISSUES
        TemplateExampleEmailInUse,
        TemplateExampleEntityNotFound
    }
}
