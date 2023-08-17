using System.Security.Claims;

namespace BackendAPI.Helpers
{
    public interface IGetValueToken
    {
        public string GetClaimValue(HttpContext httpContext, string valueType);
        public List<string> GetRoleClaimValue(HttpContext httpContext);
    }

    public class GetValueToken : IGetValueToken
    {
        public string GetClaimValue(HttpContext httpContext, string valueType)
        {
            if (string.IsNullOrEmpty(valueType)) return null;
            var identity = httpContext.User.Identity as ClaimsIdentity;
            var valueObj = identity == null ? null : identity.Claims.FirstOrDefault(x => x.Type == valueType);
            return valueObj == null ? null : valueObj.Value;
        }
        public List<string> GetRoleClaimValue(HttpContext httpContext)
        {
            List<Claim> roleClaims = httpContext.User.FindAll(ClaimTypes.Role).ToList();
            var roles = new List<string>();

            foreach (var role in roleClaims)
            {
                roles.Add(role.Value);
            }
            return roles;
        }
    }
}
