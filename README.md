# transom-smtp
Add simple to use SMTP messaging functions to your server-side Transomjs code.

[![CI](https://github.com/transomjs/transom-smtp/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/transomjs/transom-smtp/actions/workflows/ci.yml)

## Installation

```bash
$ npm install --save @transomjs/transom-smtp
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

    transom.initialize(server, myApi).then(function(server){
    	...
    });

```
