'use strict';
const SmtpHandler = require('./lib/smtpHandler');

function TransomSendMail() {
    this.initialize = function(server, options) {
        options = options || {};
        const smtpDefn = server.registry.get(
            'transom-config.definition.smtp',
            {}
        );
        const smtpOptions = Object.assign({}, options, smtpDefn);
        server.registry.set(
            options.registryKey || 'transomSmtp',
            new SmtpHandler(server, smtpOptions)
        );
    };
}

module.exports = new TransomSendMail();
