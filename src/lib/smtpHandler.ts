import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Builds the mailer that transom-smtp registers (as "transomSmtp" by default).
 *
 * `options` supplies defaults for every message (e.g. `from`) and the `smtp` transport
 * settings. `helpers` adds a sendFrom<Name>() method per entry, bound to that sender:
 *
 * @example
 * helpers: {
 *   noreply: '"No Replies" donotreply@hello.com',
 *   admin: '"Administrator" administrator@hello.com'
 * }
 * // adds sendFromNoreply() and sendFromAdmin()
 *
 * A plain function, so existing `new SmtpHandler(...)` calls keep working.
 */
function SmtpHandler(_server: unknown, options: SmtpHandler.SmtpOptions): SmtpHandler.Mailer {
  options.helpers = options.helpers || {};
  const helpers = options.helpers;

  function sendMail(mailOptions: SmtpHandler.MailOptions, callback?: SmtpHandler.SendCallback): void {
    const opts = Object.assign({}, options, mailOptions);

    // A new transport for every message. Boundary: `smtp` is passed to nodemailer as-is,
    // as before, even when it isn't set.
    const transport = nodemailer.createTransport(opts.smtp as SMTPTransport.Options);
    transport.sendMail(opts, function (err, response) {
      if (err) {
        if (callback) {
          callback(err);
        }
        return;
      }
      transport.close();
      if (callback) {
        callback(null, response);
      }
    });
  }

  const result: SmtpHandler.Mailer = {
    sendMail,
  };

  // Add simple helpers where the method name is bound to the sender.
  Object.keys(helpers).map(function (key) {
    const titleCase = key.charAt(0).toUpperCase() + key.slice(1);
    result[`sendFrom${titleCase}`] = function (opts, callback) {
      // Note: sets `from` on the caller's object.
      opts.from = helpers[key];
      sendMail(opts, callback);
    };
  });

  return result;
}

declare namespace SmtpHandler {
  /** nodemailer's message options: from, to, cc, bcc, subject, text, html, attachments, ... */
  type MailOptions = Mail.Options;

  /** Called with the error, or with null and nodemailer's SentMessageInfo. */
  type SendCallback = (err: Error | null, info?: SMTPTransport.SentMessageInfo) => void;

  type SendFn = (mailOptions: MailOptions, callback?: SendCallback) => void;

  /** The registered mailer. */
  interface Mailer {
    /** Sends one message through a new transport, merged over the configured defaults. */
    sendMail: SendFn;
    /** One per entry in `helpers`: sends with `from` set to that helper's address. */
    [helper: `sendFrom${string}`]: SendFn;
  }

  /**
   * transom-smtp's options: from transom.configure() and the API definition's
   * `definition.smtp` section (which wins). Any message field set here is a default
   * for every message.
   */
  interface SmtpOptions extends MailOptions {
    /** The registry key for the mailer. Defaults to "transomSmtp". */
    registryKey?: string;
    /** nodemailer transport options (or a connection URL). */
    smtp?: SMTPTransport.Options | string;
    /** Sender addresses, by helper name; each adds a sendFrom<Name>() method. */
    helpers?: Record<string, string>;
  }
}

export = SmtpHandler;
