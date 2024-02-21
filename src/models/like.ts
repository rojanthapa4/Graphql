import { Model, DataTypes } from 'sequelize';
import sequelize from '../Database/sequelizeConnection';
import Post from './post';

class Like extends Model {}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reactionEnum: {
      type: DataTypes.ENUM('LIKE'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Like',
  }
);

Post.hasMany(Like, {
  foreignKey: "postId",
  as: "likes"
});

export default Like;
