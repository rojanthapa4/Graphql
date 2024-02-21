import { ReactionEnum } from "../enum";

export interface PostLikeInput {
  postId: string;
  reaction: ReactionEnum;
}
