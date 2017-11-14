'use strict';
const assert = require('assert');
const SmtpHandler = require('./lib/smtpHandler');

function TransomSendMail() {
	this.initialize = function (server, options) {

		// options.noreply = options.noreply || {};
		// options.noreply.name = options.noreply.name || options.noreply.email; 
		// assert(options.noreply && options.noreply.email, "TransomSendMail 'options.noreply.email' is not specified!");

		// Helpers add methods to send email to specific addresses.
		// E.g. helpers.noreply = {email: 'noreply@hello.com', name: 'No-Reply'};
		// Puts a "sendToNoreply()" method on the transomSmtp Object.
		options = options || {};		
		options.helpers = options.helpers || {};
		Object.keys(options.helpers).map(function(key) {
			assert(options.helpers[key].email, `TransomSendMail 'options.helpers.${key}.email' is not specified!`);
			options.helpers[key].name = options.helpers[key].name || options.helpers[key].email;
		});
		
		server.registry.set('transomSmtp', new SmtpHandler(server, options));
	}
}

module.exports = new TransomSendMail();