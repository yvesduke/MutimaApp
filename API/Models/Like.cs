namespace API.Models
{
    public class Like
    {
        public int LikeId { get; set; }
        public int LikeeId { get; set; }
        public virtual User Liker { get; set; }
        public virtual User Likee { get; set; }
    }
}