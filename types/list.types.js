import { gql } from "apollo-server-express";

export const listTypeDefs = gql`
  type List {
    id: ID!
    title: String!
    items: [Item]
  }

  input UpdatedList {
    id: ID!
    title: String
    items: [ID]
  }

  input NewList {
    id: ID
    title: String!
    items: [ID]
  }

  type Query {
    allLists: [List]!
    List(id: ID!): List!
  }

  type Mutation {
    newList(input: NewList!): List!
    removeList(id: ID!): List!
    updateList(input: UpdatedList!): List!
  }
`;
