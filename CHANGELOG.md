# @transomjs/transom-smtp change log

## 7.0.0
- **Uses nodemailer 10** (was 6). nodemailer 6 has nine security advisories, including SMTP
  command injection, header injection and mail to an unintended domain; all are fixed in 10.
  Changes that can reach callers through the mailer:
  - an authentication error's `code` is `ENOAUTH` (was `NoAuth`);
  - attachments fetched from https URLs now have their TLS certificate verified;
  - the old SES transports are gone (nodemailer 7 moved to SESv2); SMTP is unaffected.
- nodemailer ships its own type definitions now, so `@types/nodemailer` is no longer a
  dependency; the types build on nodemailer's.
- Dev tools: mocha 12, chai 6, c8 12, sinon 22, cross-env 10. The unused shelljs is removed.
- **Requires Node.js 22 or newer** (`engines.node` is `>=22`). The compiled code targets ES2023,
  and CI runs on Node 22 and 24.
- Rewritten in TypeScript, with type definitions. The compiled code is in `dist/`;
  `require("@transomjs/transom-smtp")` and `require("@transomjs/transom-smtp/lib/smtpHandler")`
  return the same things as before.
- Types: `SmtpOptions` (plugin and `definition.smtp` options), `Mailer` (the registered
  mailer, including the `sendFrom<Name>()` helpers), `MailOptions` and `SendCallback`.

## 2.0.0
- Updated to transom-core 2.0 and nodejs 8.0
- removed the unused shelljs dev-dependency
