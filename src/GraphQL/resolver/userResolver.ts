import { UserInputError, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../models/user';
import { Op } from 'sequelize';
import Post from '../../models/post';
import { LoginInterface, SignupInterface, DeleteInterface, UpdateUserInterface } from '../../interfaces';
import bcrypt from 'bcryptjs';
import { userSchema, loginSchema, signUpSchema, userUpdateSchema } from '../../schema';

dotenv.config();

const saltRounds: number = 10;
const secret: string | undefined = process.env.SECRET_KEY;

interface UserPayload {
  id: string;
  username: string;
  email: string;
}

function generateAccessToken(user: any): string {
  const payload: UserPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  const token: string = jwt.sign(payload, secret as string, {
    expiresIn: '2h',
  });
  return token;
}

function generateRefreshToken(user: any): string {
  const payload: UserPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  const refreshToken: string = jwt.sign(payload, secret as string, {
    expiresIn: '7d',
  });
  return refreshToken;
}

const userResolvers = {
  Query: {
    user: async (parent: any, args: { id: string }): Promise<User> => {
      try {
        const { id } = args;
        const user = await User.findByPk(id) as User;

        if (!user) {
          throw new UserInputError('User not found');
        }

        return user;
      } catch (error) {
        throw new UserInputError('Error fetching user by ID');
      }
    },
    users: async (): Promise<User[]> => {
      try {
        return await User.findAll();
      } catch (error) {
        throw new UserInputError('Error fetching users');
      }
    },
  },
  User: {
    posts: async (user: any): Promise<Post[]> => {
      try {
        return await Post.findAll({ where: { userId: user.id } });
      } catch (error) {
        throw new UserInputError('Error fetching user posts');
      }
    },
  },
  Mutation: {
    login: async (parent: any, args: LoginInterface): Promise<any> => {
      try {
        // Validate input data using Joi schema
        const { error, value } = loginSchema.validate(args);
        if (error) {
          throw new UserInputError(error.message);
        }

        const { username, password } = value;

        const user = await User.findOne({
          where: { username },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new AuthenticationError('Invalid login credentials');
        }

        const accessToken: string = generateAccessToken(user);
        const refreshToken: string = generateRefreshToken(user);
        return {
          status: 200,
          message: 'Login successful',
          accessToken,
          refreshToken,
          user,
        };
      } catch (error: any) {
        return {
          status: 401,
          message: error.message,
        }
      }
    },
    signup: async (parent: any, args: SignupInterface): Promise<any> => {
      try {
        const { error, value } = signUpSchema.validate(args);
        if (error) {
          throw new UserInputError(error.message);
        }

        // validate user data against userSchema          
        const userData = await userSchema.validateAsync(value);

        const { username, email, password } = userData;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const existingUser = await User.findOne({
          where: {
            [Op.or]: [{ username }, { email }],
          },
        });

        if (existingUser) {
          const takenFields = [];
          if (existingUser.username === username) takenFields.push('Username');
          if (existingUser.email === email) takenFields.push('Email');

          const errorMessage =
            takenFields.length === 1
              ? `${takenFields[0]} already taken`
              : `${takenFields.join(' and ')} already exist`;

          throw new UserInputError(errorMessage, {
            invalidArgs: takenFields,
          });
        }

        const newUser = await User.create({
          username,
          email,
          password: hashedPassword,
        });

        return {
          message: 'Signup successful',
          user: newUser,
        };
      } catch (error: any) {
        return {
          status: 409,
          message: error.message,
        };
      }
    },

    deleteUser: async (parent: any, args: DeleteInterface): Promise<string> => {
      const { id } = args;
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new UserInputError('User not found');
        }


        await user.destroy();

        return 'User and associated records deleted successfully';
      } catch (error) {
        console.error('Error during user deletion:', error);

        throw new UserInputError('Error during user deletion');
      }
    },

    updateUser: async (parent: any, args: UpdateUserInterface): Promise<any> => {
      try {
        const { error, value } = userUpdateSchema.validate(args);
        if (error) {
          throw new UserInputError(error.message);
        }

        const { id, username, email } = value;
        const user = await User.findByPk(id);

        if (!user) {
          throw new UserInputError('User not found');
        }

        if (username) {
          user.username = username;
        }

        if (email) {
          user.email = email;
        }

        await user.save();

        return {
          user,
          message: 'User updated successfully',
        };
      } catch (error) {
        throw new UserInputError('Error during user update');
      }
    },
  }
};

export default userResolvers;
