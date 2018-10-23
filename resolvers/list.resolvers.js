import { dynamoDb } from "../index.js";
import { getItemsByList } from "./item.resolvers.js";
import * as uuid from "uuid";

const TableName = "alex-list";

const newList = async (_, { input }) => {
  const { title } = input;

  const params = {
    TableName,
    Item: {
      id: uuid.v1(),
      title,
      items: []
    }
  };

  await dynamoDb.put(params).promise();

  return params.Item;
};

const getList = async (_, { id }) => {
  const params = {
    TableName,
    Key: { id }
  };

  const result = await dynamoDb.get(params).promise();

  return result.Item;
};

const updateList = async (_, { input }) => {
  const { id, title } = input;

  const params = {
    TableName,
    Key: { id },
    ExpressionAttributeNames: {
      "#i": "id"
    },
    ExpressionAttributeValues: {
      ":id": id,
      ":title": title
    },
    UpdateExpression: "SET title = :title",
    ConditionExpression: "#i = :id",
    ReturnValues: "ALL_NEW"
  };

  const result = await dynamoDb.update(params).promise();

  return result.Attributes;
};

const allLists = async (_, { filter }) => {
  const params = filter
    ? {
        TableName,
        FilterExpression: "contains(title, :title)",
        ExpressionAttributeValues: { ":title": filter.title }
      }
    : {
        TableName
      };

  const result = await dynamoDb.scan(params).promise();

  return result.Items;
};

const removeList = async (_, { id }) => {
  const params = {
    TableName,
    Key: { id },
    ReturnValues: "ALL_OLD"
  };

  const result = await dynamoDb.delete(params).promise();

  return result.Attributes;
};

export const listResolvers = {
  Query: {
    allLists,
    List: getList
  },
  Mutation: { newList, updateList, removeList },
  List: {
    items: list => {
      return getItemsByList(null, { listId: list.id });
    }
  }
};
