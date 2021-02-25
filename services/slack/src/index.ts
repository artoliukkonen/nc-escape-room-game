import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { paginate, openConversation, postMessage } from "./slack";
import { getParameter } from "./parameters";
import { WebAPICallResult } from "@slack/web-api";
import playerList from "./players.json";

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
const dynamo = new AWS.DynamoDB.DocumentClient();

interface SlackUser {
  email: string;
  ID: string;
}

interface TeamMember {
  slackId: string;
  email: string;
}

interface Player {
  Email: string;
}

// This function forms teams of 3 from the players.json
export async function handler(_event: APIGatewayEvent) {
  const players = playerList;
  const users = await getSlackUsers();

  const teams: TeamMember[][] = [[]];
  let members = 0;
  players.map((u: Player) => {
    const slackUser = users.find(
      (s) => s.email.toLowerCase() === u.Email.toLowerCase()
    );
    if (!slackUser) {
      // user in player.json not found in Slack
      console.log("missing: " + u.Email);
      return null;
    }
    teams[teams.length - 1].push({ slackId: slackUser.ID, email: u.Email });
    members++;
    if (members === 3) {
      members = 0;
      teams.push([]);
    }
    return u;
  });

  // If the last team has 1-2 players, move those to different teams to form teams of 4.
  if (teams[teams.length - 2] && teams[teams.length - 1].length === 1) {
    teams[teams.length - 2].push(teams[teams.length - 1][0]);
    delete teams[teams.length - 1];
  }
  if (teams[teams.length - 2] && teams[teams.length - 1].length === 2) {
    teams[teams.length - 2].push(teams[teams.length - 1][0]);
    teams[teams.length - 3].push(teams[teams.length - 1][1]);

    delete teams[teams.length - 1];
  }

  let messageDelay = 0;
  await Promise.all(
    teams.map(async (team) => {
      messageDelay += 1;
      return await sendURL(team, messageDelay);
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        numOfTeams: teams.length,
        teams,
      },
      null,
      2
    ),
  };
}

export const sendSlackMessage = async (event: SQSEvent): Promise<any> => {
  const slackToken: string = await getParameter(
    process.env.SLACK_TOKEN_PARAMETER
  );
  if (!slackToken) {
    throw new Error("Slack token not set");
  }

  const { Records } = event;
  for (const record of Records) {
    const data = JSON.parse(record.body);
    const roomId = uuid();
    if (data.team.length === 0) return;

    console.log({
      roomId,
      team: data.team,
    });
    const dynamoData = {
      id: roomId,
      sk: "Team",
      created: new Date().toISOString(),
      members: data.team,
    };

    await dynamo
      .put({
        TableName: process.env.DYNAMODB_TABLE || "",
        Item: dynamoData,
      })
      .promise();

    const slackIds = data.team.map((u) => u.slackId);
    const conversation = await openConversation(slackIds);
    try {
      await postMessage(
        conversation.channel.id,
        `:old_key: *README* :lock:

     * Tested on Chrome & Firefox (& playable on Safari)
     * Not playable on mobile
     * You can open a group call here
     * Remember to speak out loud anything you find - communication is the key for any escape room
     * If you have any troubles with playing, you can switch browser / refresh page without affecting the game
     * It's allowed & sometimes even necessary to use Google / Slack / wiki / etc.

    Enter the Escape Room: https://example.com/${roomId}/pass`
      );
    } catch (e) {
      throw new Error(e);
    }
  }
};

export const getSlackUsers = async (): Promise<SlackUser[]> => {
  const slackToken = await getParameter(
    process.env.SLACK_TOKEN_PARAMETER || ""
  );
  const allUsers: SlackUser[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  for await (const page of paginate("users.list", slackToken)) {
    page.members.forEach((user: any) => {
      if (user.profile && user.profile.email) {
        allUsers.push({
          email: user.profile.email,
          ID: user.id,
        });
      }
    });
  }

  return allUsers;
};

const sendURL = async (
  team: TeamMember[],
  DelaySeconds: number
): Promise<WebAPICallResult> => {
  const params = {
    MessageBody: JSON.stringify({
      team,
    }),
    DelaySeconds,
    QueueUrl: process.env.SQS_URL,
  };

  await sqs.sendMessage(params).promise();

  return null;
};
