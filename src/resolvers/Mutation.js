import uuid from 'uuid/v4';

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);
    if (emailTaken) throw new Error('Email taken');
    const user = {
      id: uuid(),
      ...args.data
    };
    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    // Find user to delete
    const userIndex = db.users.findIndex(user => user.id === args.id);
    if (userIndex === -1) throw new Error('User not found');
    const deletedUsers = db.users.splice(userIndex, 1);

    // Delete posts of this user
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id;

      if (match) {
        //Delete comments on each post to delete
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    });
    // Delete comments of this user
    db.comments = db.comments.filter(comment => comment.author !== args.author);

    // Return deleted User
    return deletedUsers[0];
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) throw new Error('User not found');
    const post = {
      id: uuid(),
      ...args.data
    };
    db.posts.push(post);
    return post;
  },
  deletePost(parent, args, { db }, info) {
    // Find post to delete
    const postIndex = db.posts.findIndex(post => post.id === args.id);
    if (postIndex === -1) throw new Error('Post not found');

    const deletedPosts = db.posts.splice(postIndex, 1);

    // Remove alle comments on this post
    db.comments = db.comments.filter(comment => args.id !== comment.post);

    // Return deleted post
    return deletedPosts[0];
  },
  createComment(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    const postExistsAndIsPublished = db.posts.some(
      post => post.id === args.data.post && post.published
    );
    if (!userExists || !postExistsAndIsPublished)
      throw new Error(
        "User not found or post doesn't exists or is not published"
      );
    const comment = {
      id: uuid(),
      ...args.data
    };
    db.comments.push(comment);
    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );
    if (commentIndex === -1) throw new Error('Comment not found');
    const deletedComments = db.comments.splice(commentIndex, 1);

    return deletedComments[0];
  }
};
export default Mutation;
