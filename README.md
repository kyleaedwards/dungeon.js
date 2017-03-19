# dungeon.js
Node.js social MOO/MUD framework

## Installation/Setup

`dungeon` requires Node v6+, but v7+ is recommended. If you're not using NVM, [check it out](https://github.com/creationix/nvm#install-script).

You'll also need to be running MySQL, which is currently the only supported data store. You can edit the database name and credentials in `lib/models/adapters/mysql.js` and there will be a demo schema at `schema/demo.sql` or if you'd like to start blank, use `schema/blank.sql`. Once you have NVM and MySQL running, clone this repo, `cd` into the directory and run the following:

```
nvm install v7.7.3
nvm use v7.7.3
node install
npm run start
```

Then point your browser to [http://localhost:8080](http://localhost:8080).

## Context

The context is essentially a helper object belonging to each connected user, to couple functionality with the socket connection client. These contexts are passed to the called commands where they can trigger events on the game state.

## Commands

A command is created by generating an object catchable by the `Parser`. Each command object must have the following attributes:

- **command**: The command key that the `Parser` resolves to with its logic.
- **strategy**: The `Parser` strategy that the command belongs to.
- **role**: The role a player must possess to use the command. Otherwise the user will be told they lack sufficient permissions.
- **action**: The function called when the command is invoked. The context and command data are passed in from the `Parser`.

## Handlers

Each of these modules below accept a context instance and return an event handler function to respond to a socket message with the matching key. If you'd like to add custom socket events, be sure to include the handler here.

NOTE: Chances are there will be little need to add much here, as the client should primarily be sending events as commands under the `message` event label.

Each handler must follow the interface of `(context) => Function`.

## Parser

The parser takes in a prioritized array of strategies, and each strategy will be given a chance to make sense of a prompt message until it succeeds.

### Strategies

Parser strategies take in a prompt string and attempt to extract a usable command and argument set. Each strategy is a function that accepts a phrase and returns an object containing the following attributes:

- **command** *(required)*: The desired command label that maps to the command object. The name doesn't have to match the phrase at all, and you're welcome to use any kind of synonym mapping or transformation algorithm you see fit.
- **args** *(optional)*: Split, patch, hardcode, or send in raw args to the command. The idea behind this is that you can write different strategies for different types of commands without having to rewrite the same code each time in the command action.
- **target** *(optional)*: A helper to extract the subject of the action if you don't feel like extracting it in the command action itself.

Essentially you can add anything to the object returned from the parse strategy, and that will get passed into the command action. For example, if you want to write a strategy to parse commands like `put the sword in the chest`, you can either delegate the text following the `put` command to the command action itself, or you're welcome to attach `sword` under the attribute `item` and `chest` under the attribute `location`.

### Artifacts

Any mappings can be stored in the `artifacts` directory as JSON and then required as needed.

## Prompt

Prompts are basically questions you're asking of the user to request certain information. They replace the client's default prompt experience. The prompts currently work by pushing prompts onto a queue, and messages provided by the user go into the prompt queue rather than the parser->command flow.

You can either push single prompts to the queue, or use the `series` method to provide a series that return to a single callback in an object of keys. It's a TODO to add validation to the prompts.

## State

The `State` object will be a singleton that exists on each server and holds a cache of rooms, users and sessions. The state will also be responsible for triggering actions on users and rooms outside of the current user's context.
