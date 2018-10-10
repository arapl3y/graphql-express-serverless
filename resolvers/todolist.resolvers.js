import { dynamoDb } from "../index.js";
import * as uuid from "uuid";

const newTodoList = (_, { input }) => {
  const { title } = input;

  const params = {
    TableName: "alex-todolist",
    Item: {
      id: uuid.v1(),
      title,
      todos: []
    }
  };
  return dynamoDb
    .put(params)
    .promise()
    .then(() => params.Item)
    .catch(err => {
      throw new Error(err);
    });
};

const getTodoList = (_, { id }) => {
  const params = {
    TableName: "alex-todolist",
    Key: { id }
  };

  return dynamoDb
    .get(params)
    .promise()
    .then(result => {
      return result.Item;
    })
    .catch(err => {
      throw new Error(err);
    });
};

const updateTodoList = (_, { input }) => {
  const { id, title, todos } = input;

  const params = {
    TableName: "alex-todolist",
    Key: { id },
    ExpressionAttributeNames: {
      "#i": "id"
    },
    ExpressionAttributeValues: {
      ":id": id,
      ":title": title,
      ":todos": todos
    },
    UpdateExpression: "SET title = :title, todos = :todos",
    ConditionExpression: "#i = :id",
    ReturnValues: "ALL_NEW"
  };

  return dynamoDb
    .update(params)
    .promise()
    .then(result => {
      return result.Attributes;
    })
    .catch(err => {
      throw new Error(err);
    });
};

const allTodoLists = () => {
  return dynamoDb
    .scan({ TableName: "alex-todolist" })
    .promise()
    .then(response => {
      return response.Items;
    })
    .catch(err => {
      throw new Error(err);
    });
};

const removeTodoList = (_, { id }) => {
  const params = {
    TableName: "alex-todolist",
    Key: { id },
    ReturnValues: "ALL_OLD"
  };

  return dynamoDb
    .delete(params)
    .promise()
    .then(result => {
      return result.Attributes;
    })
    .catch(err => {
      throw new Error(err);
    });
};

export const todoListResolvers = {
  Query: { allTodoLists, TodoList: getTodoList },
  Mutation: { newTodoList, updateTodoList, removeTodoList }
};
