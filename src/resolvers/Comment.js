const Comment = {
  author(parent, args, { db }, info) {
    return db.users.find(user => parent.author === user.id);
  },
  post(parent, args, { db }, info) {
    return db.posts.find(post => parent.post === post.id);
  }
};
export default Comment;
