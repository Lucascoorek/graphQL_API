import { GraphQLServer } from 'graphql-yoga';

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