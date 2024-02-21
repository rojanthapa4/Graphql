import { UserInputError, AuthenticationError } from 'apollo-server-express';
import Post from '../../models/post';
import { CreatePostInterface, DeletePostInterface } from '../../interfaces';
import { postSchema } from '../../schema';
import Comment from '../../models/comment';

const postResolvers = {
  Query: {
    post: async (parent: any, args: { id: number }): Promise<Post | null> => {
      try {
        const { id } = args;
        const post:any = await Post.findByPk(id,{
          include:[
            {
              model: Comment,
              as: 'comments'
            }
          ]

        });
        console.log(post.comments as any);
        return post;
      } catch (error) {
        throw new UserInputError('Error fetching post by ID');
      }
    },
    posts: async (): Promise<Post[]> => {
      try {
        return await Post.findAll();
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw new UserInputError('Error fetching posts');
      }
    },
  },
  Mutation: {
    createPost: async (parent: any, args: CreatePostInterface, context: any): Promise<any> => {
      try {
        const user = context.user;
        if (!user) {
          throw new AuthenticationError('Authentication required');
        }

        const { error, value } = postSchema.validate(args);
        if (error) {
          throw new UserInputError(error.message);
        }

        const { title, content } = value;

        const post = await Post.create({
          title,
          content,
          userId: user.id,
        });
        return {
          post,
          message: "Post created Successfully",
        };
      } catch (error: any) {
        if (error.name === 'SequelizeDatabaseError') {
          throw new UserInputError('Database error: Unable to create the post');
        }
        throw new UserInputError(error);
      }
    },
    deletePost: async (parent: any, args: DeletePostInterface, context: any): Promise<string> => {
      try {
        if (!context.user) {
          throw new AuthenticationError('Authentication required');
        }
        const { id } = args;

        const post = await Post.findByPk(id);
        if (!post) {
          throw new UserInputError('Post not found');
        }

        await post.destroy();
        return 'Post deleted successfully';
      } catch (error: any) {
        throw new UserInputError(error);
      }
    },
  }
};

export default postResolvers;
