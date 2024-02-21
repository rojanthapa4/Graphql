import { Model, DataTypes } from 'sequelize';
import sequelize from '../Database/sequelizeConnection';
import Comment from './comment';

class Post extends Model {}

Post.init(                           
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Post',
  }
);


export default Post;
