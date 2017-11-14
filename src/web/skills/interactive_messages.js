var debug = require('debug')('botkit:interactive_messages');

module.exports = function (controller) {

    // launch a dialog from a button click
    controller.on('interactive_message_callback', function (bot, trigger) {
        debug('interactive message callback:', trigger);
        // is the name of the clicked button "dialog?"
        if (trigger.actions[0].name.match(/^create/)) {

            var dialog = bot.createDialog(
                'Create Account',
                'callback_id',
                'Submit'
            ).addText('Password', 'password', '', {
                placeholder: 'Password for Ethereum account'
            }).addText('Confirm Password', 'confirm_password', '', {
                placeholder: 'Confirm password'
            })

            bot.replyWithDialog(trigger, dialog.asObject(), function (err, res) {
                debug('replyWithDialog response:', res);
                // handle your errors!
            });

        }

    });

    // // create special handlers for certain actions in buttons
    // // if the button action is 'say', act as if user said that thing
    // controller.middleware.receive.use(function (bot, message, next) {
    //     if (message.type == 'interactive_message_callback') {
    //         if (message.actions[0].name.match(/^say$/)) {
    //             var reply = message.original_message;

    //             for (var a = 0; a < reply.attachments.length; a++) {
    //                 reply.attachments[a].actions = null;
    //             }

    //             var person = '<@' + message.user + '>';
    //             if (message.channel[0] == 'D') {
    //                 person = 'You';
    //             }

    //             reply.attachments.push({
    //                 text: person + ' said, ' + message.actions[0].value,
    //             });

    //             bot.replyInteractive(message, reply);

    //         }
    //     }

    //     next();

    // });

}