const path = require("ramda.path");
const replace = require("ramda.replace");

const answerChallenge = (req, res) => {
  res.status(200).send(req.header("challenge"));
};

const verifyCaller = verificationToken => (req, res, next) => {
  if (req.header("verification-token") === verificationToken) {
    next();
  } else {
    res.status(401).send(`The verification-token is not set to ${verificationToken}`);
  }
};

const resolve = (dataModel, eventType, base = "/") => {
  return `${base}${toUrl(dataModel)}/${toUrl(eventType)}`;
};

const toUrl = replace(" ", "");

const routeMessages = (app, resolverFn = resolve) => (req, res) => {
  const dataModel = path(["body", "Meta", "DataModel"], req);
  const eventType = path(["body", "Meta", "EventType"], req);
  req.url = resolverFn(dataModel, eventType);
  app.handle(req, res);
};

module.exports = { answerChallenge, verifyCaller, routeMessages };
