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
    post: '1'
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
    post: '1'
  }
];

const db = {
  users,
  comments,
  posts
};

export default db;
