import { dynamoDb } from "../index.js";
import * as uuid from "uuid";

const TableName = "alex-todos";

const newTodo = (_, { input }) => {
  const { text, listId } = input;

  const params = {
    TableName,
    Item: {
      id: uuid.v1(),
      text,
      completed: false,
      listId
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

const getTodo = (_, { id }) => {
  const params = {
    TableName,
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

const updateTodo = (_, { input }) => {
  const { id, text, completed } = input;

  const params = {
    TableName,
    Key: { id },
    ExpressionAttributeNames: {
      "#i": "id",
      "#todo_text": "text"
    },
    ExpressionAttributeValues: {
      ":id": id,
      ":text": text,
      ":completed": completed
    },
    UpdateExpression: "SET #todo_text = :text, completed = :completed",
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

const allTodos = () => {
  return dynamoDb
    .scan({ TableName })
    .promise()
    .then(response => {
      return response.Items;
    })
    .catch(err => {
      throw new Error(err);
    });
};

export const getTodosByTodoList = listId => {
  const params = {
    TableName,
    FilterExpression: "listId = :id",
    ExpressionAttributeValues: { ":id": listId }
  };

  return dynamoDb
    .scan(params)
    .promise()
    .then(result => result.Items)
    .catch(err => {
      throw new Error(err);
    });
};

const removeTodo = (_, { id }) => {
  const params = {
    TableName,
    Key: { id },
    ReturnValues: "ALL_OLD"
  };

  return dynamoDb
    .delete(params)
    .promise()
    .then(result => result.Attributes)
    .catch(err => {
      throw new Error(err);
    });
};

export const todosResolvers = {
  Query: { allTodos, Todo: getTodo, getTodosByTodoList },
  Mutation: { newTodo, updateTodo, removeTodo }
};
