const express = require("express");
const cors = require("cors");
const translate = require("google-translate-api");
const bodyParser = require("body-parser");
const SENTENCES_REGEXP = /((?!=|\.).)+(.)/g;

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/build`));

app.get("/", (request, response) => {
  response.status(200).sendFile(`${__dirname}/build/index.html`);
});

app.post("/api/v1/translate", (request, response) => {
  const { text, from, to } = request.body;

  let arraySentences = null;
  if (text.length > 5000) {
    arraySentences = [];
    splitTextIntoSentences(text).reduce((current, next) => {
      if (current.length + next.length <= 5000) return (current += next);
      else {
        arraySentences.push(current);
        return next;
      }
    });
  }
  try {
    translateText({
      textArray: arraySentences || [text],
      from,
      to
    })
      .then(results => {
        response.status(200).send(
          parseTranslateResults(
            results.reduce((current, next) => {
              return {
                sourceText: current.sourceText + next.sourceText,
                targetText: current.targetText + next.targetText
              };
            })
          )
        );
      })
      .catch(error => catchError({ error, response }));
  } catch (error) {
    catchError({ error, response });
  }
});

function catchError({ error, response }) {
  console.error("catchError", { error });
  response
    .status(error.code >= 100 && error.code < 600 ? error.code : 500)
    .send(error.message ? error.message : "error occured.");
}
app.listen(port, err => {
  if (err) {
    return console.error("something doing wrong", err);
  }
  console.log(`server is listening on ${port}`);
});

function translateText({ textArray, from, to }) {
  return new Promise((resolve, reject) => {
    if (!textArray) reject("Bad Request params");
    const results = [];
    textArray.forEach(element => {
      if (!element) reject("Bad Request params");
      translate(element, {
        from: from || "auto",
        to: to || "en"
      })
        .then(res => {
          results.push({
            sourceText: element,
            targetText: res.text
          });
          if (results.length === textArray.length) resolve(results);
        })
        .catch(err => {
          console.error({ err });
          reject("Bad Request");
        });
    });
  });
}

function parseTranslateResults({ sourceText, targetText }) {
  const sourceArray = splitTextIntoSentences(sourceText),
    targetArray = splitTextIntoSentences(targetText);
  const result = [];
  console.log({
    sourceArray: sourceArray.length,
    targetArray: targetArray.length
  });

  sourceArray.forEach((sentence, i) => {
    result.push({ source: sentence, target: targetArray[i] });
  });
  return result;
}

function splitTextIntoSentences(text) {
  return text.match(SENTENCES_REGEXP);
}
