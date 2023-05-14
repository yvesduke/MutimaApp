namespace API.Models
{
    public class Role
    {
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}