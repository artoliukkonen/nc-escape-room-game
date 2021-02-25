# nc-escape-room-game

I created this game for Nordcloud Pre-Christmas party in 2020.

There's a lot of deprecated / un-used code, as the work was done mostly on my spare time & I had to adjust the scope to be able to finish this for the deadline.

One biggest thing is `User` / `Video`. There was supposed to be a video call within the game, but to minimize risks it was removed & replaced with instructions to open the call in the Slack group.

## Background

At Nordcloud we have this thing called #Kiitoskaappi (#Thank-you-closet). It's an easy way to say "thanks" to your co-worker for doing extraorginary work. In this game you travel through different Nordcloud offices and try to unlock those closets.

NOTE: Current implementation relies on an access to NC systems on few points. For your own implementation basically entire game & tasks should be reworked. Build your own story!

_If you build something on top of this project, please let me know!_

## Requirements

- AWS account
- Slack & access token for Slack bot (if you want to use automatic messages & team forming)

## Setup

- Search the project for `example.com` to see all places where you need to udpate things
- Run `yarn && yarn ci:deploy` in root
- Insert tasks & answers to DynamoDB table (TODO: example)

## Notes

- `name` from the root `package.json` is used as a prefix for all serverless services
- `services/common` project contains DynamoDB resource block for single table design
