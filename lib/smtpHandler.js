'use strict';
const nodemailer = require('nodemailer');

module.exports = function SmtpHandler(server, options) {
    options.helpers = options.helpers || {};

    function sendMail(mailOptions, callback) {
        const opts = Object.assign({}, options, mailOptions);

        // Send mail with defined transport object
        const transport = nodemailer.createTransport(opts.smtp);
        transport.sendMail(opts, function(err, response) {
            if (err) {
                // console.error("SMTP transport failed.", err);
                if (callback) {
                    callback(err);
                }
                return;
            }
            transport.close();
            if (callback) {
                callback(null, response);
            }
        });
    }
    
    const result = {
        sendMail
    };

    // Add simple helpers where the method name is bound to the recipient.
    Object.keys(options.helpers).map(function (key) {
        const titleCase = key.charAt(0).toUpperCase() + key.slice(1);

        result[`sendTo${titleCase}`] = function(opts, callback) {
            opts.from = options.helpers[key].email;
            opts.fromname = options.helpers[key].name;
            sendMail(opts, callback);
        };
    });

    return result;
};