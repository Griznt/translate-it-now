const express = require("express");
const cors = require("cors");
const translate = require("google-translate-api");

const port = 3000;
const app = express();
app.use(cors());

app.use(express.static(`${__dirname}/../../build`));

app.get("/", (request, response) => {
  response.status(200).sendFile(`${__dirname}/../../build/index.html`);
});

app.get("/api/v1/translate", (request, response) => {
  const query = request.query;

  if (query.text) {
    translate(query.text, {
      from: query.source ? query.source : "auto",
      to: query.target ? query.target : "en"
    })
      .then(res => {
        response.status(200).send(
          parseTranslateResults({
            sourceText: query.text,
            targetText: res.text
          })
        );
      })
      .catch(err => {
        console.error({ err }, "MESSAGA: ", err.message);
        response
          .status(err.code ? err.code : 500)
          .send(err.message ? err.message : "error occured.");
      });
  }
});
app.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${port}`);
});

function parseTranslateResults({ sourceText, targetText }) {
  const sourceArray = sourceText.split("\n"),
    targetArray = targetText.split("\n");

  const result = [];

  sourceArray.forEach((sentanse, i) => {
    result.push({ source: sentanse, target: targetArray[i] });
  });
  return result;
}
