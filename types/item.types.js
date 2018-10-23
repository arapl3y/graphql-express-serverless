import { gql } from "apollo-server-express";

export const itemTypeDefs = gql`
  type Item {
    id: ID!
    text: String!
    completed: Boolean!
    listId: ID!
  }

  input UpdatedItem {
    id: ID!
    text: String
    completed: Boolean
    listId: ID
  }

  input NewItem {
    id: ID
    text: String!
    completed: Boolean
    listId: ID!
  }

  input ItemFilter {
    id: ID
    text: String
    completed: Boolean
    listId: ID
  }

  extend type Query {
    allItems(completed: Boolean, text: String): [Item]!
    Item(id: ID!): Item!
    getItemsByList(listId: ID!): [Item]!
  }

  extend type Mutation {
    newItem(input: NewItem!): Item!
    removeItem(id: ID!): Item!
    updateItem(input: UpdatedItem!): Item!
  }
`;
