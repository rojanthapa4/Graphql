import { AuthenticationError, UserInputError } from 'apollo-server-express';
import Comment from '../../models/comment';
import User from '../../models/user';
import Post from '../../models/post';
import Reply from '../../models/reply';
import { CreateCommentInterface, CommentDeleteInterface } from '../../interfaces';
import { commentSchema } from '../../schema';

const commentResolvers = {
  Query: {
    comment: async (parent: any, args: { id: string }): Promise<Comment | null> => {
      try {
        return await Comment.findByPk(args.id);
      } catch (error) {
        throw new UserInputError('Error fetching comment by ID');
      }
    },
    comments: async (parent: any, args: any): Promise<Comment[]> => {
      try {
        return await Comment.findAll();
      } catch (error) {
        throw new UserInputError('Error fetching comments');
      }
    },
  },
 
  Mutation: {
    createComment: async (parent: any, args: CreateCommentInterface, context: any): Promise<{ comment: Comment; message: string }> => {
      try {
        const { error, value } = commentSchema.validate(args);
        if (error) {
          throw new UserInputError(error.message);
        }
    
        if (!context.user) {
          throw new AuthenticationError('Authentication required');
        }
    
        const { text, postId } = value; 
        const comment = await Comment.create({
          text, 
          postId,
          userId: context.user.id,
        });
    
        return {
          comment,
          message: 'Comment created successfully',
        };
      } catch (error) {
        throw new UserInputError('Error during comment creation', { error });
      }
    },
    

    deleteComment: async (parent: any, args: CommentDeleteInterface, context: any): Promise<string> => {
      try {
        if (!context.user) {
          throw new AuthenticationError('Authentication required');
        }

        const { id } = args;
        const comment = await Comment.findByPk(id);
        if (!comment) {
          throw new UserInputError('Comment not found');
        }

        await comment.destroy();
        return 'Comment deleted successfully';
      } catch (error) {
        throw new UserInputError('Error during comment deletion', { error });
      }
    },
  },
};

export default commentResolvers;
