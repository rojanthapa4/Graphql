import { Model, DataTypes } from 'sequelize';
import sequelize from '../Database/sequelizeConnection';
import User from './user';
import Post from './post';

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
  }
);
Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments'
})
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });


export default Comment;
