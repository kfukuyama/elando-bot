var debug = require('debug')('botkit:dialog_submissions');

export function setupDialogSubmissionSkill(controller) {
    // use a receive middleware hook to validate a form submission
    // and use bot.dialogError to respond with an error before the submission
    // can be sent to the handler
    controller.middleware.receive.use(function validateDialog(bot, message, next) {


        // if (message.type == 'dialog_submission') {

        //     if (message.submission.number > 100) {
        //         bot.dialogError({
        //             "name": "number",
        //             "error": "Please specify a value below 100"
        //         });
        //         return;
        //     }
        // }

        next();

    });


    // handle a dialog submission
    // the values from the form are in event.submission    
    controller.on('dialog_submission', function (bot, message) {
        debug('dialog submission message:', message);

        var submission = message.submission;
        bot.reply(message, 'Your account has been created!');

        // call dialogOk or else Slack will think this is an error
        bot.dialogOk();
    });
}