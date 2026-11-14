// Compiled by `npm run typecheck` only: checks the published types the way a consumer uses them.
import transomSmtp = require("../../dist");
import SmtpHandler = require("../../lib/smtpHandler");

const options: transomSmtp.SmtpOptions = {
  from: "app@example.com",
  smtp: { host: "smtp.example.com", port: 587, auth: { user: "u", pass: "p" } },
  helpers: { noreply: "no-reply@example.com" },
};

// What a transom-core server needs to provide.
const registry = new Map<string, unknown>();
const server: transomSmtp.PluginServer = {
  registry: {
    get: (key, defaultValue) => registry.get(key) ?? defaultValue,
    set: (key, value) => void registry.set(key, value),
  },
};
transomSmtp.initialize(server, options);

const mailer: transomSmtp.Mailer = SmtpHandler(server, options);
mailer.sendMail({ to: "a@example.com", subject: "Hi", html: "<p>Hi</p>" }, (err, info) => {
  if (err) {
    throw err;
  }
  const id: string | undefined = info?.messageId;
  return id;
});
const helper = mailer.sendFromNoreply;
helper?.({ to: "b@example.com", text: "Hello" });
