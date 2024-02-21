import { gql } from 'apollo-server-express';


const authTypeDefs = gql`
  type AuthPayload {
  status: Int!
  accessToken: String
  refreshToken: String
  user: User
  message: String
}

type SignUpAuth {
  user: User
  message: String
}

type Mutation {
  login(username: String!, password: String!): AuthPayload
  signup(username: String!, email: String!, password: String!): SignUpAuth
}

`;

export default authTypeDefs;
