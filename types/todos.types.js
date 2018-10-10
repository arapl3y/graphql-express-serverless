import { gql } from "apollo-server-express";

export const todosTypeDefs = gql`
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
    listId: ID!
  }

  input UpdatedTodo {
    id: ID!
    text: String
    completed: Boolean
    listId: ID
  }

  input NewTodo {
    id: ID
    text: String!
    completed: Boolean
    listId: ID!
  }

  extend type Query {
    allTodos: [Todo]!
    Todo(id: ID!): Todo!
    getTodosByTodoList(listId: ID!): [Todo]!
  }

  extend type Mutation {
    newTodo(input: NewTodo!): Todo!
    removeTodo(id: ID!): Todo!
    updateTodo(input: UpdatedTodo!): Todo!
  }
`;
