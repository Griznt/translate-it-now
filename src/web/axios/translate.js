import axios from "axios";
const SERVER_URL = "http://localhost:4000";

// Abstract API request function
function makeApiRequest(data, authNeeded) {
  let url = SERVER_URL + "/api/v1/translate";

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
        console.log(resp.data);
        onSuccess(resp.data);
      } else onFailure(`Request failed${resp ? ` with status: ${resp.status}` : ""}`);
    })
    .catch(error => {
      console.error(error);
      onFailure(`Error occured: ${error.message ? error.message : error}`);
    });
}
