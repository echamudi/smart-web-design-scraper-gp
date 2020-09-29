import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";

import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/typeDefs";
import { context } from "./graphql/context"

import dbConfig from "./configs/database.config"

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });

  server.applyMiddleware({ app });

  await mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
