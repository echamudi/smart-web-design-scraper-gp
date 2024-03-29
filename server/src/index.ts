import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/typeDefs";
import { context } from "./graphql/context"

import dbConfig from "./configs/database.config"
import { Role } from "./models/role.model";

const startServer = async () => {

  // Prepare express

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });

  server.applyMiddleware({ app, bodyParserConfig: {
    limit: '100mb', 
  } });

  // Prepare database

  await mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true
  });

  const userRole = await Role.findOne({ name: 'user' });

  if(!userRole) {
    await new Role({name: 'user'}).save()
  }

  const adminRole = await Role.findOne({ name: 'admin' });
  if(!userRole) {
    await new Role({name: 'admin'}).save()
  }

  // Start server

  app.use(express.json({limit: '50mb'}));
  app.listen({ port: 3001 }, () =>
    console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`)
  );
};

startServer();
