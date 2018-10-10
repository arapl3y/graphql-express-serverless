import { gql } from "apollo-server-express";

export const todoListTypeDefs = gql`
  type TodoList {
    id: ID!
    title: String!
    todos: [Todo]
  }

  input UpdatedTodoList {
    id: ID!
    title: String
    todos: [ID]
  }

  input NewTodoList {
    title: String!
  }

  type Query {
    allTodoLists: [TodoList]!
    TodoList(id: ID!): TodoList!
  }

  type Mutation {
    newTodoList(input: NewTodoList!): TodoList!
    removeTodoList(id: ID!): TodoList!
    updateTodoList(input: UpdatedTodoList!): TodoList!
  }
`;
