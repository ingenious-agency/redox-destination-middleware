# Redox Destination Utils

This package is a collection of express middleware functions that helps building Redox destination apps with node and express.

When you set up a Redox destination, this means an endpoint that listens to requests from the Redox engine you need to do the following:

1. First respond to a challenge that redox engine sends to verify that you own the server the redox engine will be calling
2. Verify on each request that the caller is redox
3. Handle in a particular way each message type you can receive

## `answerChallenge(req, res)`

The `answerChallenge` middleware will return to Redox engine the challenge sent by in the request with a status of `200`.

```js
const express = require("express");
const { answerChallenge } = require("@ingenious-redox/destination-middleware");
const app = express();

app.get("/", answerChallenge); // Use `app.get` when the challenge is configured with GET for your destination on Redox engine UI

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
```

## `verifyCaller(verificationToken) => (req, res)`

```js
const express = require("express");
const { answerChallenge } = require("@ingenious-redox/destination-middleware");
const app = express();

app.use(verifyCaller(process.env.VERIFICATION_TOKEN)); // This verification token should match the one that's configured for your destination on Redox engine UI

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
```

The `verifyCaller` middleware is configured with the verification token and returns a middleware in charge of validating the correct header.

## `routeMessages(app, resolverFn) => (req, res)`

The `routeMessages` lets you handle the different types of Data Models and Event Types in different URLs of your express app. For example, if you want to receive all `PatientPush` from the `Clinical Summary` you can use `routeMessages` and later register the following URL `app.post("/ClinicalSummary/PatientPush")`.

`routeMessages` receives the express `app` and optionally a `resolverFn(dataModel, eventType)`. The `resolverFn` is in charge of normalizing the data model and event type names, the default implementation removes spaces and redirects to `/DataModelName/EventTypeName`.

```js
const express = require("express");
const bodyParser = require("body-parser");
const { routeMessages } = require("@ingenious-redox/destination-middleware");
const app = express();

app.use(bodyParser.json());
app.post("/", routeMessages(app));
app.post("/ClinicalSummary/PatientPush", (req, res) => {
  // Do something with req.body
  console.log(req.body);
  res.sendStatus(201);
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
```
