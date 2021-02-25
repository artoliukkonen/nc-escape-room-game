import { AppSyncResolverEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { getRoomById } from "../room/index";

const dynamo = new DynamoDB.DocumentClient();

export async function answer(context: AppSyncResolverEvent<any>) {
  console.log("answer", context);
  const { id, taskId, answer } = context.arguments;

  const room = await getRoomById(id);

  const task = (
    await dynamo
      .get({
        TableName: process.env.DYNAMODB_TABLE || "",
        Key: {
          id: taskId,
          sk: "Task",
        },
      })
      .promise()
  ).Item;

  if (
    taskId === "teamname" ||
    task.answer.toLowerCase() === answer.toLowerCase()
  ) {
    // TODO: Check that room is really in this task
    await dynamo
      .update({
        TableName: process.env.DYNAMODB_TABLE || "",
        Key: {
          id,
          sk: "Room",
        },
        UpdateExpression: "set #answers = :answers",
        ExpressionAttributeNames: {
          "#answers": "answers",
        },
        ExpressionAttributeValues: {
          ":answers": { ...room.answers, [taskId]: answer },
        },
      })
      .promise();
    if (
      task.progress &&
      !["helsinki", "jyvaskyla", "stockholm", "munich", "poznan"].includes(id)
    ) {
      await dynamo
        .update({
          TableName: process.env.DYNAMODB_TABLE || "",
          Key: {
            id,
            sk: "Room",
          },
          UpdateExpression: "set #task = :task",
          ExpressionAttributeNames: {
            "#task": "task",
          },
          ExpressionAttributeValues: {
            ":task": parseInt(taskId) + 1,
          },
        })
        .promise();
    }

    if (parseInt(taskId) === 0) {
      await dynamo
        .update({
          TableName: process.env.DYNAMODB_TABLE || "",
          Key: {
            id,
            sk: "Room",
          },
          UpdateExpression: "set #start = :start",
          ExpressionAttributeNames: {
            "#start": "start",
          },
          ExpressionAttributeValues: {
            ":start": new Date().toISOString(),
          },
        })
        .promise();
    }

    if (parseInt(taskId) === 5) {
      await dynamo
        .update({
          TableName: process.env.DYNAMODB_TABLE || "",
          Key: {
            id,
            sk: "Room",
          },
          UpdateExpression: "set #end = :end",
          ExpressionAttributeNames: {
            "#end": "end",
          },
          ExpressionAttributeValues: {
            ":end": new Date().toISOString(),
          },
        })
        .promise();
    }

    return {
      id: "123",
      correct: true,
      nextRoom: "cde",
    };
  } else {
    return {
      id: "123",
      correct: false,
    };
  }
}

export async function getRoomTask(context: AppSyncResolverEvent<any>) {
  console.log("getRoomTask", context);
  const { task } = context.source;

  return (
    await dynamo
      .get({
        TableName: process.env.DYNAMODB_TABLE || "",
        Key: {
          id: task.toString(),
          sk: "Task",
        },
      })
      .promise()
  ).Item;
}

export const task = getRoomTask;
