import express, { RequestHandler } from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import typeDefs from './GraphQL/typeDefs';
import resolvers from './GraphQL/resolver';
import dotenv from 'dotenv';
import  sequelize  from './Database/sequelizeConnection'; // Import the Sequelize instance

dotenv.config();

const PORT = process.env.PORT || 3000;

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app: express.Application = express();

// Middleware to verify JWT token
const middleware: RequestHandler = (req: any, _, next) => {
  const token = req.headers.authorization;
  const secret: string | undefined = process.env.SECRET_KEY;
  if (token && secret) {
    try {
      const user = jwt.verify(token, secret) as any; // verify and decode the token
      req.user = user; // attach the decoded user to the request object
    } catch (error) {
      throw new AuthenticationError('Invalid token');
    }
  }

  next();
};

app.use(middleware);

async function startApolloServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully');

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        return { user: req.user }; // This makes the user object available in the context
      },
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }
}

startApolloServer();
