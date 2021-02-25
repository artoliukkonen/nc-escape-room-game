"use strict";

import { WebAPICallResult, WebClient, KnownBlock } from "@slack/web-api";
import { getParameter } from "./parameters";

let webClient: WebClient = null;

const getClient = (slackToken: string): WebClient => {
  if (!webClient) {
    webClient = new WebClient(slackToken);
  }

  return webClient;
};

export const postMessage = async (
  channel: string,
  message: string,
  blocks?: KnownBlock[],
  slackToken?: string
): Promise<WebAPICallResult> => {
  const payload = {
    as_user: true,
    channel,
    mrkdwn: true,
    blocks,
    text: null,
  };
  if (!blocks) {
    payload.text = message;
  }

  let token: string = slackToken;
  if (!token) {
    token = await getParameter(process.env.SLACK_TOKEN_PARAMETER || "");
  }
  const client = getClient(token);
  return client.chat.postMessage(payload);
};

export const openConversation = async (
  users: string[],
  slackToken?: string
): Promise<WebAPICallResult> => {
  const payload = {
    users: users.join(","),
  };

  let token: string = slackToken;
  if (!token) {
    token = await getParameter(process.env.SLACK_TOKEN_PARAMETER || "");
  }
  const client = getClient(token);
  return client.conversations.open(payload);
};

export const paginate = (
  methodName: string,
  slackToken: string
): AsyncIterator<WebAPICallResult> => {
  const client = getClient(slackToken);
  return client.paginate(methodName);
};

export const getProfile = (
  user: string,
  slackToken: string
): Promise<WebAPICallResult> => {
  const client = getClient(slackToken);
  return client.users.profile.get({
    user,
  });
};
