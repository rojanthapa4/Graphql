import { MyContext } from "../../interfaces/contextInterface";
import { PostLikeInput } from "../../interfaces/likeInterface";
import Post from "../../models/post";
import Like from "../../models/like";

const likeResolver = {
  Query: {
    getTotalLike: async (parent: any, args: any, context: MyContext) => {
      try {
        if (!context.user) {
          throw new Error("Authorization header is missing");
        }
        const { postId } = args.input;
        const PostData = await Post.findByPk(postId, {
          include: [
            {
              model: Like,
              as: "likes",
            },
          ],
        });
        const post = PostData?.dataValues;
        if (!post) {
          throw new Error(`Post with post id ${postId} is not found `);
        }
        console.log(post.likes);
        return {
          data: {
            post: post,
            likes: post?.likes,
            likeCount: post?.likes?.length
          },
        };
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    postLike: async (
      parent: any,
      args: { input: PostLikeInput },
      context: MyContext
    ) => {
      try {
        if (!context.user) {
          throw new Error("Authorization header missing");
        }
        const { postId, reaction } = args.input;
        const likeExists = await Like.findOne({
          where: { postId, userId: context.user.id },
        });
        if (likeExists) {
          await likeExists.destroy();
          return {
            message: "You have unliked this post",
          };
        }
        const likePost = await Like.create({
          postId,
          userId: context.user.id,
          reactionEnum: reaction,
        });
        return {
          data: likePost,
          message: "You have liked this post",
        };
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};

export default likeResolver;
