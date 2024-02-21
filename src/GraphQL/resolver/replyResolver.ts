import { AuthenticationError, UserInputError } from 'apollo-server-express';
import User from '../../models/user';
import Comment from '../../models/comment';
import Reply from '../../models/reply';
import { replySchema } from '../../schema';
import { CreateReplyInterface, DeleteReplyInterface } from '../../interfaces';

const replyResolvers = {
  Query: {
    reply: async (parent: any, args: { id: string }): Promise<Reply | null> => {
      try {
        return await Reply.findByPk(args.id);
      } catch (error) {
        throw new UserInputError('Error fetching reply by ID');
      }
    },
    replies: async (): Promise<Reply[]> => {
      try {
        return await Reply.findAll();
      } catch (error) {
        throw new UserInputError('Error fetching replies');
      }
    },
  },
  Reply: {
    author: async (reply: any): Promise<User | null> => {
      try {
        return await User.findByPk(reply.userId);
      } catch (error) {
        throw new UserInputError('Error fetching reply author');
      }
    },
    comment: async (reply: any): Promise<Comment | null> => {
      try {
        return await Comment.findByPk(reply.commentId);
      } catch (error) {
        throw new UserInputError('Error fetching reply comment');
      }
    },
  },
  Mutation: {
    createReply: async (parent: any, args: CreateReplyInterface, context: any): Promise<{ reply: Reply; message: string }> => {
      try {
        const { error, value } = replySchema.validate(args);
        if (error) {
          throw new UserInputError(error.message);
        }

        if (!context.user) {
          throw new AuthenticationError('Authentication required');
        }

        const { text, commentId } = value;

        const reply = await Reply.create({
          text,
          commentId,
          userId: context.user.id,
        });

        return {
          reply,
          message: 'Reply created successfully',
        };
      } catch (error) {
        throw new UserInputError('Error during reply creation', { error });
      }
    },
    deleteReply: async (parent: any, args: DeleteReplyInterface, context: any): Promise<string> => {
      try {
        if (!context.user) {
          throw new AuthenticationError('Authentication required');
        }
        const { id } = args;
        const reply = await Reply.findByPk(id);
        if (!reply) {
          throw new UserInputError('Reply not found');
        }
        await reply.destroy();
        return 'Reply deleted successfully';
      } catch (error) {
        throw new UserInputError('Error during reply deletion', { error });
      }
    },
  }
};

export default replyResolvers;