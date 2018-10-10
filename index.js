import express from "express";
import serverless from "serverless-http";
import graphiql from "graphql-playground-middleware-express";
import merge from "lodash.merge";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { todoListResolvers, todosResolvers } from "./resolvers";
import { todoListTypeDefs, todosTypeDefs } from "./types";
import * as AWS from "aws-sdk";

export const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000"
});

const typeDefs = [todoListTypeDefs, todosTypeDefs];
const resolvers = merge({}, todoListResolvers, todosResolvers);

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  path: "/graphql"
});

server.applyMiddleware({ app });

app.get("/playground", graphiql({ endpoint: "/graphql" }));

const handler = serverless(app);

export { handler };
