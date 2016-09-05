using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using MVCReactTODO.Models;

namespace MVCReactTODO.Controllers
{
    public class CommentController : ApiController
    {
        private List<TODOLIST> todos = null;
        private ReactappEntities ent = null;

        public CommentController()
        {
            todos = new List<TODOLIST>();
            ent = new ReactappEntities();
        }

        [HttpGet]
        [Route("api/comment")]
        public IEnumerable<TODOLIST> GetComments()
        {
            var todos = ent.TODOLIST.ToList();
            return todos;
        }

        [HttpPost]
        [Route("api/comment")]
        public void AddComment(TODOLIST todo)
        {
            ent.TODOLIST.Add(todo);
            ent.SaveChanges();  
        }

        [HttpDelete]
        [Route("api/comment/{commentId}")]
        public void DeleteComment(int commentId)
        {
            // This line is to find out the record by the id
            TODOLIST todo = ent.TODOLIST.Find(commentId);

            //This part is use for Delete
            ent.TODOLIST.Remove(todo);
            ent.SaveChanges();
        }
    }
}