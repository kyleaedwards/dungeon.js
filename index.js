/**
 * Imports
 */
const express = require('express');
const http = require('http');
const uuid = require('uuid/v4');
const socketIO = require('socket.io');
const Parser = require('./lib/parser');
const Context = require('./lib/context');
const State = require('./lib/state');
const handlers = require('./lib/handlers');

/**
 * Constants
 */
const app = express();
const server = http.createServer(app);
const serverName = uuid();
const io = socketIO(server);
const PORT = process.env.PORT || 5000;
const parser = new Parser();
const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * LOCAL GAME STATE
 */
const state = new State();

/**
 * Use webpack for hot reloading while developing.
 */
if (IS_DEV) {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config');
  const compiler = webpack(webpackConfig);
  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(require("webpack-hot-middleware")(compiler));
}

/**
 * Webserver functionality for the client.
 */
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public', { index: false }));
const appView = IS_DEV ? 'index.dev.html' : 'index.html';
app.get('/', (req, res) => {
  res.render(appView);
});

io.on('connection', (client) => {

  /**
   * Each connection has a context with dependencies injected. All actions on
   * context should pertain mainly to that user's connection OR pass along
   * responsibility to the game state, which will funnel responses out to
   * relevant user contexts.
   */
  const context = new Context(client, state, serverName);

  // Set up handlers to respond to socket events.
  for (let label in handlers) {
    try {
      const handler = handlers[label](context, parser);
      client.on(label, handler);
    } catch (e) {
      console.error('Invalid handler interface: ', e);
    }
  }

});

/**
 * Start the server.
 */
server.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
