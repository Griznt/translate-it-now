const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SENTENCES_REGEXP = /((?!=|\.).)+(.)/g;
const MAX_STRING_LENGTH = 4; //4500
// const translate = require("google-translate-api");
const YANDEX_API_KEY =
  "trnsl.1.1.20180921T133552Z.4ceccb513e8e9ce0.36e668fdb19a2fcaecd6b8977e380eb0fb4071ef";
const translate = require("yandex-translate")(YANDEX_API_KEY);

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
  if (text.length > MAX_STRING_LENGTH) {
    arraySentences = [];

    splitTextIntoSentences(text).reduce((current, next, index, arr) => {
      if (current.length + next.length <= MAX_STRING_LENGTH) {
        if (arr[arr.length - 1] === next) {
          arraySentences.push((current += `\r\n${next}`));
        }
        return (current += `\r\n${next}`);
      } else {
        arraySentences.push(current);
        if (arr[arr.length - 1] === next) {
          arraySentences.push(next);
        }
        return next;
      }
    }, "");
  }
  try {
    translateText({
      textArray: arraySentences || [text], // .map(item => splitTextIntoSentences(item).join("\r\n")) // .filter(item => !!item) // splitTextIntoSentences(text).join("\r\n"),
      from,
      to
    })
      .then(results => {
        console.log({ results });
        response.status(200).send(
          // parseTranslateResults(
          results.sort((o1, o2) => o1.i > o2.i).map(item => {
            return { source: item.sourceText, target: item.targetText };
          })
          // .reduce((current, next) => {
          //   return {
          //     sourceText: current.sourceText + next.sourceText,
          //     targetText: current.targetText + next.targetText
          //   };
          // }
          // )
          // )
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

function translateIt(text, { from, to }) {
  return new Promise((resolve, reject) => {
    translate.translate(text, { from, to }, (err, res) => {
      console.log({ from, to, err, res });
      if (err) reject(err);
      else if (res.code === 200) resolve(res.text);
      else reject(res);
    });
  });
}

function translateText({ textArray, from, to }) {
  return new Promise((resolve, reject) => {
    if (!textArray) reject("Bad Request params");
    const results = [];
    textArray
      .map(element => (element.length > 0 ? element : "\r\n"))
      .forEach((element, i) => {
        if (!element) reject("Bad Request params");
        translateIt(element, {
          from: from || "auto",
          to: to || "en"
        })
          .then(res => {
            results.push({
              i,
              sourceText: element,
              targetText: res[0]
            });
            console.log(i, { results });
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
  const sourceArray = sourceText.split("\r\n"),
    targetArray = targetText.split("\r\n");
  const result = [];
  sourceArray.forEach((sentence, i) => {
    result.push({ source: sentence, target: targetArray[i] });
  });
  return result;
}

function splitTextIntoSentences(text) {
  return text.match(SENTENCES_REGEXP);
}
