# storage-bot
Botkit bot used to test different storage adapters.

## Overview

This is a very bare bones bot that can be used to functionally test different storage adapters for Botkit.
Type `@<botname> help` for a list of commands.

## Set up

You can run the bot locally or it contains a PROCFILE for simple deployment to Heroku.
Simply clone the bot and set the appropriate environment variables to run.

## Environment Variables

`SLACK_API_TOKEN`: The bot's Slack API token.

`STORAGE`: The storage backend to use. Should be one of `mongo`, `redis`, or `firebase`.
By default, will fall back to the native botkit simple storage (file system). NOTE: simple storage
won't work on Heroku.

`FIREBASE_URI`: If `STORAGE` is `firebase`, used to set the `firebase_uri` property of the firebase adapter.

`MONGO_URL`: If `STORAGE` is `mongo`, used to set the `mongoUri` property of the MongoDB adapter.

`REDIS_URL`: If `STORAGE` is `redis`, used to set the `url` property of the Redis adapter.
