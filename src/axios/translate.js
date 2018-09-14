import axios from "axios";

// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
const apiKey = "AIzaSyCJ7_NoaZ4cFjupJuTikKc0-Oq1wH1sAdg";

// Set endpoints
const endpoints = {
  translate: "",
  detect: "detect",
  languages: "languages"
};

// Abstract API request function
function makeApiRequest(endpoint, data, type, authNeeded) {
  let url = "https://www.googleapis.com/language/translate/v2/" + endpoint;
  url += "?key=" + apiKey;

  // If not listing languages, send text to translate
  if (endpoint !== endpoints.languages) {
    url += "&q=" + encodeURI(data.source.text);
  }

  // If translating, send target and source languages
  if (endpoint === endpoints.translate) {
    url += "&target=" + data.target.language.value;
    url += "&source=" + data.source.language.value;
  }
  // Return response from API
  return axios.get(url, {
    data: data ? JSON.stringify(data) : "",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

// Translate
export function translate(data, onSuccess, onFailure) {
  makeApiRequest(endpoints.translate, data, "GET", false)
    .then(function(resp) {
      if (resp && resp.status === 200) {
        onSuccess(resp.data.translations[0].translatedText);
      } else onFailure(`Request failed with status: ${resp.status}`);
    })
    .catch(error => {
      console.error(error);
      onFailure(`Error occured: ${error.message ? error.message : error}`);
    });
}
