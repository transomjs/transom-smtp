# @transomjs/transom-smtp change log

## 6.0.0
- **Requires Node.js 22 or newer** (`engines.node` is `>=22`). The compiled code targets ES2023,
  and CI runs on Node 22 and 24.
- Rewritten in TypeScript, with type definitions. The compiled code is in `dist/`;
  `require("@transomjs/transom-smtp")` and `require("@transomjs/transom-smtp/lib/smtpHandler")`
  return the same things as before.
- Types: `SmtpOptions` (plugin and `definition.smtp` options), `Mailer` (the registered
  mailer, including the `sendFrom<Name>()` helpers), `MailOptions` and `SendCallback`.
  `@types/nodemailer` is now a dependency, since the types build on it.

## 2.0.0
- Updated to transom-core 2.0 and nodejs 8.0
- removed the unused shelljs dev-dependency
