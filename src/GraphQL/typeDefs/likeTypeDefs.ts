import { gql } from 'apollo-server-express';

const likeTypeDefs = gql`
  type Like {
    id: ID!
    userId: ID!
    postId: ID
    commentId: ID
    reactionEnum: String
  }
  
  type Post {
    description: String
  }
  
  type LikeCount {
    post: Post
    likes: [Like]
    likeCount: Int
  }
  
  type LikeCountResponse {
    data: LikeCount
  }
  
  enum ReactionEnum {
    LIKE
  }
  
  input PostLikeInput {
    postId: String
    reaction: ReactionEnum
  }
  
  input GetLikeCount {
    postId: String  
  }
  
  type LikeResponse {
    data: Like
    message: String
  }
  
  type Query {
    getTotalLike(input: GetLikeCount): LikeCountResponse
  }
  
  type Mutation {
    postLike(input: PostLikeInput): LikeResponse   
  }
`;

export default likeTypeDefs;
