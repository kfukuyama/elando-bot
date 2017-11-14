/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/
This is a sample Slack bot built with Botkit.
This bot demonstrates many of the core features of Botkit:
* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.
# RUN THE BOT:
  Create a new app via the Slack Developer site:
    -> http://api.slack.com
  Get a Botkit Studio token from Botkit.ai:
    -> https://studio.botkit.ai/
  Run your bot from the command line:
    clientId=<MY SLACK TOKEN> clientSecret=<my client secret> PORT=<3000> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js
# USE THE BOT:
    Navigate to the built-in login page:
    https://<myhost.com>/login
    This will authenticate you with Slack.
    If successful, your bot will come online and greet you.
# EXTEND THE BOT:
  Botkit has many features for building cool and useful bots!
  Read all about it here:
    -> http://howdy.ai/botkit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  usage_tip();
  process.exit(1);
}

import * as Botkit from 'botkit';
const debug = require('debug')('botkit:main');

import { setupUserRegistration } from './web/components/user_registration';
import { setupExpress } from './web/components/express_webserver';
import { setupOnBoarding } from './web/components/onboarding';
import { setupDialogSubmissionSkill } from './web/skills/dialog_submissions';
import { setupHearsSkill } from './web/skills/hears';
import { setupInteractiveMessagesSkill } from './web/skills/interactive_messages';
import { SlackConfiguration } from 'botkit';

var bot_options: SlackConfiguration = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  debug: true,
  scopes: ['bot'],
  storage: undefined,
  json_file_store: undefined,
  // studio_token: process.env.studio_token,
  // studio_command_uri: process.env.studio_command_uri
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
  var mongoStorage = require('botkit-storage-mongo')({ mongoUri: process.env.MONGO_URI });
  bot_options.storage = mongoStorage;
} else {
  bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const server = setupExpress(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
setupUserRegistration(controller);

// Send an onboarding message when a new team joins
setupOnBoarding(controller);

// Setup Skills
setupDialogSubmissionSkill(controller);
setupHearsSkill(controller);
setupInteractiveMessagesSkill(controller);

server.listen(+process.env.PORT || 3000, null, function () {

  debug('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3000);

});

function usage_tip() {
  console.log('~~~~~~~~~~');
  console.log('Botkit Starter Kit');
  console.log('Execute your bot application like this:');
  console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js');
  console.log('Get Slack app credentials here: https://api.slack.com/apps')
  console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
  console.log('~~~~~~~~~~');
}