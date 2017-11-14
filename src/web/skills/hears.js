/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

module.exports = function (controller) {

    controller.hears(['^hi', '^hello'], 'direct_message,direct_mention', function (bot, message) {

        bot.reply(message, {
            attachments: [{
                title: 'May I help you?',
                callback_id: '123',
                attachment_type: 'default',
                actions: [{
                        "name": "create",
                        "text": "Create Account",
                        "value": "create",
                        "type": "button",
                    },
                    {
                        "name": "no",
                        "text": "No Thanks",
                        "value": "no",
                        "type": "button",
                    }
                ]
            }]
        });

    });

};