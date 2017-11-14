import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as querystring from 'querystring';
import { setupIncomingWebhooksRoute } from './routes/incoming_webhooks';
import { setupOauthRoute } from './routes/oauth';

var debug = require('debug')('botkit:webserver');

export function setupExpress(controller) {


    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));

    // import express middlewares that are present in /components/express_middleware
    // var normalizedPath = require("path").join(__dirname, "express_middleware");
    // require("fs").readdirSync(normalizedPath).forEach(function(file) {
    //     require("./express_middleware/" + file)(webserver, controller);
    // });

    // var normalizedPath = require("path").join(__dirname, "../public");
    webserver.use(express.static("public"));



    // import all the pre-defined routes that are present in /components/routes
    setupIncomingWebhooksRoute(webserver, controller);
    setupOauthRoute(webserver, controller);

    controller.webserver = webserver;

    return webserver;

}
