import { AppSyncResolverEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { getRoomById } from "../room";

const dynamo = new DynamoDB.DocumentClient();

export async function hint(context: AppSyncResolverEvent<any>) {
  const { id } = context.arguments;
  const room = await getRoomById(id);

  const taskList = [
    {
      id: "0",
      hint: "Type any name to the lock, and it'll give you code to continue",
    },
    {
      id: "1-2",
      hint:
        "Did you find the computer? Wiki should have public passwords documented",
    },
    {
      id: "1-1",
      hint: "Yogi instructor name should be documented in wiki",
    },
    {
      id: "1",
      hint:
        "UV-light works when lights are off. Did you scan all surfaces with the light?",
    },
    {
      id: "2-0",
      hint: "Some lights are on, some are off. And do you have sounds on?",
    },
    { id: "2", hint: "There's no riddle here, just the text on the wall" },
    {
      id: "3-0-0",
      hint:
        "Must Relate To Values Somehow. I've Seen These Black Frames Somewhere...",
    },
    {
      id: "3-0-1",
      hint:
        "Must Relate To Values Somehow. I've Seen These Black Frames Somewhere...",
    },
    {
      id: "3-0-2",
      hint:
        "Must Relate To Values Somehow. I've Seen These Black Frames Somewhere...",
    },
    {
      id: "3-0-3",
      hint:
        "Must Relate To Values Somehow. I've Seen These Black Frames Somewhere...",
    },
    { id: "3-0", hint: "The combination is in the post-its" },
    { id: "3", hint: "Märkte du Sverige flaggan?" },
    {
      id: "4-1",
      hint: "Did you turn the TV on? Have sounds on? Eins, Zwei, Drei...",
    },
    {
      id: "4",
      hint: "Munich Frauenkirche on the lock. Seen it somewhere else too?",
    },
    { id: "5-1", hint: "Noticed the text in kitchen wall?" },
    { id: "5", hint: "Pretty colors in TV. Start counting from Santa." },
  ];

  const answered = Object.keys(room.answers || {});

  const task = taskList.find((t) => !answered.includes(t.id));
  const hint = {
    time: new Date().toISOString(),
    task: task.id,
    hint: task.hint,
  };

  if (room.hints.findIndex((h) => h.task === task.id) === -1) {
    const hints = room.hints || [];
    hints.push(hint);

    await dynamo
      .update({
        TableName: process.env.DYNAMODB_TABLE || "",
        Key: {
          id,
          sk: "Room",
        },
        ReturnValues: "ALL_NEW",
        UpdateExpression: "set #hints = :hints",
        ExpressionAttributeNames: { "#hints": "hints" },
        ExpressionAttributeValues: {
          ":hints": hints,
        },
      })
      .promise();
  }

  return hint;
}
