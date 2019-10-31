import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';

const users = [
  {
    id: '1',
    name: 'Lukas',
    email: 'lukas@gmail.com',
    age: 38
  },
  {
    id: '2',
    name: 'Kasia',
    email: 'kasia@gmail.com'
  },
  {
    id: '3',
    name: 'Witek',
    email: 'wito@gmail.com',
    age: 5
  }
];

const posts = [
  {
    id: '1',
    title: 'First Post',
    body: 'This is a First post',
    published: true,
    author: '2'
  },
  {
    id: '2',
    title: 'Second Post',
    body: 'This is a Second post',
    published: false,
    author: '2'
  },
  {
    id: '3',
    title: 'Third Post',
    body: 'This is a Third post!',
    published: true,
    author: '1'
  }
];

const comments = [
  {
    id: 'Comment1',
    text: 'This is comment 1',
    author: '3',
    post: '1'
  },
  {
    id: 'Comment2',
    text: 'This is comment 2',
    author: '3',
    post: '2'
  },
  {
    id: 'Comment3',
    text: 'This is comment 3',
    author: '2',
    post: '2'
  },
  {
    id: 'Comment4',
    text: 'This is comment 4',
    author: '1',
    post: '3'
  }
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput{
    title: String! 
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
     author: ID!
     post: ID!
  }

  type User {
    name: String!
    age: Int
    id: ID!
    email: String!
    posts: [Post!]!
    comments: [Comment!]!
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) return users;
      return users.filter(user =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(parent, args, ctx, info) {
      if (!args.query) return posts;
      return posts.filter(
        post =>
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    comments(parent, args, ctx, info) {
      return comments;
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
  },

  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email);
      if (emailTaken) throw new Error('Email taken');
      const user = {
        id: uuid(),
        ...args.data
      };
      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      if (!userExists) throw new Error('User not found');
      const post = {
        id: uuid(),
        ...args.data
      };
      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      const postExistsAndIsPublished = posts.some(
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
      comments.push(comment);
      return comment;
    }
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => parent.id === post.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => parent.id === comment.author);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => parent.author === user.id);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => parent.post === post.id);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log('Server is up'));
