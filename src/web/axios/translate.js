import axios from "axios";
import { SERVER_URL, TRANSLATE_API_URL } from "../const";

// Abstract API request function
function makeApiRequest(data, authNeeded) {
  let url = SERVER_URL + TRANSLATE_API_URL;

  url += "?text=" + encodeURI(data.source.text);

  url += "&target=" + data.target.language.value;
  url += "&source=" + data.source.language.value;

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
  makeApiRequest(data, false)
    .then(function(resp) {
      if (resp && resp.status === 200) {
        onSuccess(resp.data);
      } else {
        onFailure(
          `Request failed${resp ? ` with status: ${resp.status}` : ""}`
        );
      }
    })
    .catch(error => {
      console.error(error);
      onFailure(`Error occured: ${error.message ? error.message : error}`);
    });
}
