## services/slack

This service sends Slack message to teams. Participants are fetched from `players.json` whitelist.

## Setup

1. Update `players.json`
2. Store Slack access token to SSM (see `serverless.yml`)
3. Update message in `index.ts`
4. Invoke the function manually when you want to send the messages
