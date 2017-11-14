'use strict';
const assert = require('assert');
const SmtpHandler = require('./lib/smtpHandler');

function TransomSendMail() {
	this.initialize = function (server, options) {

		options = options || {};				
		server.registry.set(options.registryKey || 'transomSmtp', new SmtpHandler(server, options));
	}
}

module.exports = new TransomSendMail();