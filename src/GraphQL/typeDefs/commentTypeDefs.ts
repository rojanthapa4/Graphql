import { gql } from 'apollo-server-express';

const commentTypeDefs = gql`
  type Comment {
    id: ID
    text: String
    replies: [Reply]
  }
  
  type createCommentReq {
    comment: Comment
    message: String
  }
  
  type Query {
    comment(id: ID!): Comment
    comments: [Comment]
  }
  
  type Mutation {
    createComment(text: String!, postId: Int!): createCommentReq
    deleteComment(id: ID!): String
    updateComment(id: ID!, text: String): createCommentReq
  }
`;

export default commentTypeDefs;
