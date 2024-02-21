import { gql } from 'apollo-server-express';


const userTypeDefs = gql`
  type User {
  id: ID!
  username: String!
  email: String!
  posts: [Post]!
}

type UpdateUser {
  user: User
  message: String
}

type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  deleteUser(id: ID!): String
  updateUser(id: ID!, username: String, email: String): UpdateUser  
}

`;

export default userTypeDefs;
