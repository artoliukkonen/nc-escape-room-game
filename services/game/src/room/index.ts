// TODO: Refactor properly
// This file is a result of many quick hacks & ad-hoc refactorings

import { AppSyncResolverEvent } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();

export async function updateRoom(context: AppSyncResolverEvent<any>) {
  const { id, input } = context.arguments;

  if (!input.state) {
    return getRoomById(id);
  }

  return (
    await dynamo
      .update({
        TableName: process.env.DYNAMODB_TABLE || "",
        Key: {
          id,
          sk: "Room",
        },
        ReturnValues: "ALL_NEW",
        UpdateExpression: "set #state = :state",
        ExpressionAttributeNames: { "#state": "state" },
        ExpressionAttributeValues: {
          ":state": input.state,
        },
      })
      .promise()
  ).Attributes;
}

export async function createRoom(context: AppSyncResolverEvent<any>) {
  const id = context.arguments.id || uuid();
  const data = {
    id,
    sk: "Room",
    task: 0,
    state: {},
    hints: [],
  };

  await dynamo
    .put({
      TableName: process.env.DYNAMODB_TABLE || "",
      Item: data,
    })
    .promise();

  return data;
}

export async function getRoom(context: AppSyncResolverEvent<any>) {
  const { id, room } = context.source ? context.source : context.arguments;
  const roomId = room || id;
  console.log("GET ROOM", roomId);

  let result = await getRoomById(roomId);

  if (!result) {
    return await createRoom({
      arguments: { id: roomId },
      request: { headers: {} },
      info: {
        selectionSetList: [],
        selectionSetGraphQL: "",
        parentTypeName: "",
        fieldName: "",
        variables: [],
      },
    });
  }

  return result;
}

export const room = getRoom;

export const getRoomById = async (id) => {
  return (
    await dynamo
      .get({
        TableName: process.env.DYNAMODB_TABLE || "",
        Key: {
          id,
          sk: "Room",
        },
      })
      .promise()
  ).Item;
};
