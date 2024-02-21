import { mergeTypeDefs } from '@graphql-tools/merge';
import userTypeDefs from './userTypeDefs';
import postTypeDefs from './postTypeDefs';
import authTypeDefs from './authTypeDefs';
import commentTypeDefs from './commentTypeDefs';
import replyTypeDefs from './replyTypeDefs';
import likeTypeDefs from './likeTypeDefs';

const typeDefs = mergeTypeDefs([userTypeDefs, postTypeDefs, authTypeDefs, commentTypeDefs, replyTypeDefs, likeTypeDefs]);
export default typeDefs;
