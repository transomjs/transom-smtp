# transom-smtp
Add simple to use SMTP messaging functions to your server-side Transomjs code.

[![Build Status](https://travis-ci.org/transomjs/transom-smtp.svg?branch=master)](https://travis-ci.org/transomjs/transom-smtp)
[![Coverage Status](https://coveralls.io/repos/github/transomjs/transom-smtp/badge.svg?branch=master)](https://coveralls.io/github/transomjs/transom-smtp?branch=master)

## Installation

```bash
$ npm install transom-smtp
```

## Usage

#### options.smtp
options.smtp is passed in directly to nodemailer.createTransport() and follows the nodemailer configuration.

#### options.helpers
options.helpers adds methods to send email from specific addresses.
The following example puts "sendFromNoreply()" and "sendFromAdmin()" methods on the transomSmtp Object.

NOTE: a sendFromNoreply() method is required when using transomSmtp with the transom-mongoose-localuser.

```
    const Transom = require('@transomjs/transom-core');
    const transomSmtp = require('@transomjs/transom-smtp');

    const transom = new Transom();

    const options = {
        smtp: {
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
                user: 'username',
                pass: 'password'
            }
        },
        helpers: {
            noreply: '"No Replies" donotreply@hello.com',
            admin: 'administrator@hello.com'
		}
    };
    transom.configure(transomSmtp, options);

    transom.initialize(server, myApi);

```
