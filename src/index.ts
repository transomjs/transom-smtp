import SmtpHandler = require("./lib/smtpHandler");

/**
 * The parts of the transom-core server this plugin uses. Any transom-core server fits.
 */
interface SmtpPluginServer {
  registry: {
    get(key: string, defaultValue: object): unknown;
    set(key: string, value: unknown): void;
  };
}

/**
 * Registers a mailer (see SmtpHandler) in the registry, as "transomSmtp" unless
 * `registryKey` says otherwise. Configure it with transom.configure(transomSmtp, options)
 * and/or the API definition's `definition.smtp` section, which wins.
 */
class TransomSendMail {
  initialize = (server: SmtpPluginServer, options?: SmtpHandler.SmtpOptions): void => {
    options = options || {};
    // Boundary: the API definition's smtp section has the same shape as the options.
    const smtpDefn = server.registry.get("transom-config.definition.smtp", {}) as SmtpHandler.SmtpOptions;
    const smtpOptions: SmtpHandler.SmtpOptions = Object.assign({}, options, smtpDefn);
    server.registry.set(options.registryKey || "transomSmtp", SmtpHandler(server, smtpOptions));
  };
}

/** The plugin instance, as `require("@transomjs/transom-smtp")` has always returned. */
const transomSmtp = new TransomSendMail();

declare namespace transomSmtp {
  type SmtpOptions = SmtpHandler.SmtpOptions;
  type MailOptions = SmtpHandler.MailOptions;
  type SendCallback = SmtpHandler.SendCallback;
  type Mailer = SmtpHandler.Mailer;
  type PluginServer = SmtpPluginServer;
}

export = transomSmtp;
