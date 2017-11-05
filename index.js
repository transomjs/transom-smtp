'use strict';
const SmtpHandler = require('./lib/smtpHandler');

function TransomSendMail() {
	this.initialize = function (server, options) {
		server.registry.set('transomSmtp', new SmtpHandler(server, options));
	}
}

module.exports = new TransomSendMail();