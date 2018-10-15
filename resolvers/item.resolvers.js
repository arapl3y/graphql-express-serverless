import { dynamoDb } from "../index.js";
import * as uuid from "uuid";

const TableName = "alex-items";

const newItem = async (_, { input }) => {
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

  const result = await dynamoDb.put(params).promise();

  return params.Item;
};

const getItem = async (_, { id }) => {
  const params = {
    TableName,
    Key: { id }
  };

  await dynamoDb.get(params).promise();

  return result.Item;
};

const updateItem = async (_, { input }) => {
  const { id, text, completed } = input;

  const params = {
    TableName,
    Key: { id },
    ExpressionAttributeNames: {
      "#i": "id",
      "#item_text": "text"
    },
    ExpressionAttributeValues: {
      ":id": id,
      ":text": text,
      ":completed": completed
    },
    UpdateExpression: "SET #item_text = :text, completed = :completed",
    ConditionExpression: "#i = :id",
    ReturnValues: "ALL_NEW"
  };

  const result = await dynamoDb.update(params).promise();

  return result.Attributes;
};

const allItems = async () => {
  const result = await dynamoDb.scan({ TableName }).promise();

  return result.Items;
};

export const getItemsByList = async (_, { listId }) => {
  const params = {
    TableName,
    FilterExpression: "listId = :id",
    ExpressionAttributeValues: { ":id": listId }
  };

  const result = await dynamoDb.scan(params).promise();

  return result.Items;
};

const removeItem = async (_, { id }) => {
  const params = {
    TableName,
    Key: { id },
    ReturnValues: "ALL_OLD"
  };

  const result = await dynamoDb.delete(params).promise();

  return result.Attributes;
};

export const itemResolvers = {
  Query: { allItems, Item: getItem, getItemsByList },
  Mutation: { newItem, updateItem, removeItem }
};
