import express from "express";
import serverless from "serverless-http";
import graphiql from "graphql-playground-middleware-express";
import merge from "lodash.merge";
import { ApolloServer } from "apollo-server-express";
import { listResolvers, itemResolvers } from "./resolvers";
import { listTypeDefs, itemTypeDefs } from "./types";
import * as AWS from "aws-sdk";

// Local
// export const dynamoDb = new AWS.DynamoDB.DocumentClient({
//   region: "localhost",
//   endpoint: "http://localhost:8000"
// });

export const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-southeast-2",
  endpoint: "https://dynamodb.ap-southeast-2.amazonaws.com"
});

const typeDefs = [listTypeDefs, itemTypeDefs];
const resolvers = merge({}, listResolvers, itemResolvers);

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  path: "/graphql"
});

server.applyMiddleware({ app });

app.get("/playground", graphiql({ endpoint: "/graphql" }));

const handler = serverless(app);

export { handler };
