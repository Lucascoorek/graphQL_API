const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) return db.users;
    return db.users.filter(user =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  posts(parent, args, { db }, info) {
    if (!args.query) return db.posts;
    return db.posts.filter(
      post =>
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  me() {
    return {
      name: 'LUKASZ',
      id: '123adc',
      age: 23,
      email: 'lukasz@gmail.com'
    };
  },
  post() {
    return {
      id: '456asd',
      title: 'Post title',
      body: 'Some post body...',
      published: true
    };
  }
};

export default Query;
