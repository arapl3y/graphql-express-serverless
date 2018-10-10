import { gql } from "apollo-server-express";

export const todosTypeDefs = gql`
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
  }
`;
