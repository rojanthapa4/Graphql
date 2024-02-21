import { Model, DataTypes } from 'sequelize';
import sequelize from '../Database/sequelizeConnection';
import User from './user';
import Comment from './comment';

class Reply extends Model {}

Reply.init(
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
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Reply',
  }
);

Reply.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Reply.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });

export default Reply;
