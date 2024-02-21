import { DataTypes, Model } from 'sequelize';
import sequelize from '../Database/sequelizeConnection';
import Post from './post';

interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;

}

class User extends Model<UserAttributes> {
  id!: number;
  username!: string;
  email!: string;
  password!: string;

}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  },
  {
    sequelize,
    modelName: 'User',
  }
);

User.hasMany(Post, {foreignKey: "userId", as: 'posts' });

Post.belongsTo(User,{ foreignKey: "userId", as: "user"})


export default User;