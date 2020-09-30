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

  server.applyMiddleware({ app });

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

  let port: number;
  if (process.env.DOCKER_CONTAINER) {
    port = 80
  } else {
    port = 3001;
  }

  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:80${server.graphqlPath}`)
  );
};

startServer();
