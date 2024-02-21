import { gql } from 'apollo-server-express';


const postTypeDefs = gql`
type Post {
  id: Int!
  title: String!
  content: String!
  comments: [Comment]
}

type createPostReq {
  post: Post
  message: String
}

type Query {
  post(id: Int!): Post
  posts: [Post!]!
}

type Mutation {

  createPost(title: String!, content: String!): createPostReq
  deletePost(id: ID!): String
}

`;

export default postTypeDefs;
