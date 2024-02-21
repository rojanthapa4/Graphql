import { mergeResolvers } from '@graphql-tools/merge';
import userResolver from './userResolver';
import postResolver from './postResolver';
import commentResolvers from './commentResolver';
import replyResolvers from './replyResolver';
import likeResolver from './likeResolver';


const resolver = mergeResolvers([userResolver, postResolver, commentResolvers, replyResolvers, likeResolver]);
export default resolver;
