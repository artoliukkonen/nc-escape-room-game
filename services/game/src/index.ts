import * as AWS from "aws-sdk";
import { AppSyncResolverEvent, APIGatewayEvent } from "aws-lambda";
import * as RoomOps from "./room/";
import * as UserOps from "./user/";
import * as TaskOps from "./task/";
import * as HintOps from "./hint/";

AWS.config.update({ region: process.env.AWS_REGION });

const dynamo = new AWS.DynamoDB.DocumentClient();

interface GQLOps {
  [key: string]: (event: AppSyncResolverEvent<any>) => Promise<any>;
}

// Merge operations to a single object
const ops: GQLOps = Object.assign({}, RoomOps, UserOps, TaskOps, HintOps);

export async function handler(event: AppSyncResolverEvent<any>) {
  console.log("GraphQL handler", event);

  if (!ops.hasOwnProperty(event.info.fieldName)) {
    console.error("Unknown operation", event.info.fieldName);
    throw new Error(`Unknown operation ${event.info.fieldName}`);
  }

  try {
    console.log("calling ", event.info.fieldName);
    const opHandler = ops[event.info.fieldName];
    const result = await opHandler(event);

    console.log("result: ", result);

    return result;
  } catch (err) {
    console.error("Operation failed", event.info.fieldName, err);
    throw err;
  }
}

// Quick hack for "admin UI" so that one could watch game progress of players in real time
export async function admin(event: APIGatewayEvent) {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      rooms: (
        await dynamo
          .scan({
            TableName: process.env.DYNAMODB_TABLE || "",
          })
          .promise()
      ).Items.filter((i) => i.sk === "Room"),
    }),
  };
}
