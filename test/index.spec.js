"use strict";
const sinon = require('sinon');
const PocketRegistry = require('pocket-registry');
const nodemailer = require('nodemailer');
const transomSmtp = require('../');

describe('TransomSmtp plugin', function () {
    let expect;

    before(function () {
        // Use a dynamic import for the chai ES module!
        return import("chai").then((chai) => (expect = chai.expect));
    });

    function serverWith(smtpDefinition) {
        const registry = new PocketRegistry();
        if (smtpDefinition) {
            registry.set('transom-config.definition.smtp', smtpDefinition);
        }
        return { registry };
    }

    it('is a single plugin instance', function () {
        expect(transomSmtp.constructor.name).to.equal('TransomSendMail');
        expect(Object.keys(transomSmtp)).to.deep.equal(['initialize']);
        expect(require('../')).to.equal(transomSmtp);
    });

    it('registers a mailer as "transomSmtp" by default', function () {
        const server = serverWith();
        transomSmtp.initialize(server);
        const mailer = server.registry.get('transomSmtp');
        expect(mailer.sendMail).to.be.a('function');
    });

    it('registers under a custom registryKey', function () {
        const server = serverWith();
        transomSmtp.initialize(server, { registryKey: 'myMailer' });
        expect(server.registry.has('myMailer')).to.equal(true);
        expect(server.registry.has('transomSmtp')).to.equal(false);
    });

    describe('merging options', function () {
        let sent;

        beforeEach(function () {
            sent = [];
            sinon.stub(nodemailer, 'createTransport').callsFake(function (smtp) {
                return {
                    sendMail(opts, cb) { sent.push({ smtp, opts }); cb(null, { messageId: 'id' }); },
                    close() {}
                };
            });
        });

        afterEach(function () {
            nodemailer.createTransport.restore();
        });

        it('lets the API definition override configure() options, and builds helpers from either', function (done) {
            const server = serverWith({
                from: 'definition@example.test',
                smtp: { host: 'smtp.definition.test' },
                helpers: { admin: 'admin@example.test' }
            });
            transomSmtp.initialize(server, { from: 'configure@example.test', replyTo: 'reply@example.test' });
            const mailer = server.registry.get('transomSmtp');

            mailer.sendFromAdmin({ to: 'a@example.test' }, function (err, info) {
                expect(err).to.equal(null);
                expect(info.messageId).to.equal('id');
                expect(sent).to.have.length(1);
                expect(sent[0].smtp).to.deep.equal({ host: 'smtp.definition.test' });
                expect(sent[0].opts.from).to.equal('admin@example.test');
                // configure() options still apply where the definition doesn't set them.
                expect(sent[0].opts.replyTo).to.equal('reply@example.test');
                done();
            });
        });

        it('uses configure() options when the definition has no smtp section', function (done) {
            const server = serverWith();
            transomSmtp.initialize(server, { from: 'configure@example.test' });
            server.registry.get('transomSmtp').sendMail({ to: 'b@example.test' }, function () {
                expect(sent[0].opts.from).to.equal('configure@example.test');
                done();
            });
        });
    });
});
