'use strict';
const nodemailer = require('nodemailer');

module.exports = function SmtpHandler(server, options) {
    
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

    return {
        sendMail
    };
};