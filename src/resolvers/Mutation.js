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
    db.comments = db.comments.filter(comment => comment.author !== args.id);

    // Return deleted User
    return deletedUsers[0];
  },

  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id);

    if (!user) throw new Error('User not found');

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);
      if (emailTaken) throw new Error('Email taken');
      user.email = data.email;
    }
    if (typeof data.name === 'string') {
      user.name = data.name;
    }
    if (typeof data.age !== undefined) {
      user.age = data.age;
    }
    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) throw new Error('User not found');
    const post = {
      id: uuid(),
      ...args.data
    };
    db.posts.push(post);
    if (args.data.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'CREATED',
          data: post
        }
      });
    }
    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    // Find post to delete
    const postIndex = db.posts.findIndex(post => post.id === args.id);
    if (postIndex === -1) throw new Error('Post not found');

    const [post] = db.posts.splice(postIndex, 1);

    // Remove all comments on this post
    db.comments = db.comments.filter(comment => args.id !== comment.post);

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      });
    }

    // Return deleted post
    return post;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);
    const originalPost = { ...post };
    let updated = false; // THIS IS NEW

    if (!post) {
      throw new Error('Post not found');
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
      updated = true; // THIS IS NEW
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
      updated = true; // THIS IS NEW
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (updated) {
      // THIS IS CHANGED
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
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
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });

    return comment;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );
    if (commentIndex === -1) throw new Error('Comment not found');
    const [comment] = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    });
    return comment;
  },

  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) throw new Error('Comment not found');

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });
    return comment;
  }
};

export default Mutation;
