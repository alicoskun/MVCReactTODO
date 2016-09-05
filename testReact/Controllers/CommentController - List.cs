//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web.Http;
//using MVCReactTODO.Models;

//namespace MVCReactTODO.Controllers
//{
//    // This is List version of this app
//    // and uses Comment class as model
//    public class CommentController : ApiController
//    {
//        private static readonly List<Comment> comments = new List<Comment>
//        {
//            new Comment
//            {
//                Id = 1,
//                Author = "Ali Coşkun",
//                Text = "Metal is just noice."
//            }
//        };

//        [HttpGet]
//        [Route("api/comment")]
//        public IEnumerable<Comment> GetComments()
//        {
//            return comments;
//        }

//        [HttpPost]
//        [Route("api/comment")]
//        public void AddComment(Comment comment)
//        {
//            comment.Id = new Random().Next();
//            comments.Add(comment);
//        }

//        [HttpDelete]
//        [Route("api/comment/{commentId}")]
//        public void DeleteComment(int commentId)
//        {
//            // todo: normally we would check for existence
//            comments.Remove(comments.First(x => x.Id == commentId));
//        }
//    }
//}