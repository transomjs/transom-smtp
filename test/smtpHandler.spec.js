"use strict";
const sinon = require('sinon');
const SmtpHandler = require('../lib/smtpHandler');
const nodemailer = require('nodemailer');

describe('SmtpHandler', function () {
    let expect;

    before(function () {
        // Use a dynamic import for the chai ES module!
        return import("chai").then((chai) => (expect = chai.expect));
    });

    beforeEach(function () {
        // Stub out a mock nodemailer
        sinon.stub(nodemailer, 'createTransport').callsFake(function (opts) {
            function Transport() {
                this.sendMail = function (opts, cb) {
                    if (cb) {
                        return cb(opts.error, opts.response);
                    }
                };
                this.close = sinon.spy();
            };
            return new Transport();
        });
    });

    afterEach(function () {
        // restore original functionality
        nodemailer.createTransport.restore();
    });

    it('can call createTransport', function () {
        const dummyServer = {};
        const dummyOptions = {};
        const transomSmtp = new SmtpHandler(dummyServer, dummyOptions);

        transomSmtp.sendMail({
            from: "noreply@transomjs",
            html: "Hello"
        });
        sinon.assert.calledOnce(nodemailer.createTransport);
    });

    it('can callback with an error', function () {
        const dummyServer = {};
        const dummyOptions = {};
        const transomSmtp = new SmtpHandler(dummyServer, dummyOptions);

        const callback = sinon.spy();
        transomSmtp.sendMail({
            error: "My-error"
        }, callback);
        sinon.assert.calledOnce(nodemailer.createTransport);
        expect(callback.calledOnce).to.be.true;
        expect(callback.calledWith('My-error'));
    });

    it('can callback with a response', function () {
        const dummyServer = {};
        const dummyOptions = {};
        const transomSmtp = new SmtpHandler(dummyServer, dummyOptions);

        const callback = sinon.spy();
        transomSmtp.sendMail({
            response: "My-response"
        }, callback);
        sinon.assert.calledOnce(nodemailer.createTransport);
        expect(callback.calledOnce).to.be.true;
        expect(callback.calledWith(null, 'My-response'));
    });

    it('can create dynamic sendTo methods', function () {
        const dummyServer = {};
        const dummyOptions = {
            helpers: {
                noreply: '"Mr. Foobar" foo@bar.baz'
            }
        };
        const transomSmtp = new SmtpHandler(dummyServer, dummyOptions);

        const callback = sinon.spy();
        transomSmtp.sendFromNoreply({
            response: "My-response"
        }, callback);
        sinon.assert.calledOnce(nodemailer.createTransport);
        expect(callback.calledOnce).to.be.true;
        expect(callback.calledWith(null, 'My-response'));
    });

});