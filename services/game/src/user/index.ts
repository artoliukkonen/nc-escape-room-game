import { AppSyncResolverEvent } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();

export async function createUser(context: AppSyncResolverEvent<any>) {
  // const { name } = context.arguments;

  const id = uuid();
  const roomId = uuid();
  const data = {
    id,
    sk: "User",
    room: roomId,
  };

  return dynamo
    .put({
      TableName: process.env.DYNAMODB_TABLE || "",
      Item: data,
    })
    .promise();
}

export async function me(context: AppSyncResolverEvent<any>) {
  let { id } = context.arguments;

  if (id) {
    return (
      await dynamo
        .get({
          TableName: process.env.DYNAMODB_TABLE || "",
          Key: {
            id: id,
            sk: "User",
          },
        })
        .promise()
    ).Item;
  }

  if (!id) {
    id = uuid();
    const roomId = uuid();

    const data = {
      id,
      sk: "User",
      room: roomId,
    };

    await dynamo
      .put({
        TableName: process.env.DYNAMODB_TABLE || "",
        Item: data,
      })
      .promise();

    return data;
  }
}
