import React from "react";
import axios from "axios";
import "./app.css";
import FileInputContainer from "../input/file-input-container";
import SelectContainer from "../select/select-container";
import ButtonContainer from "../button/button-container";
import Loader from "../loader/loader";
import { translate as translateApi } from "../../axios/translate";
import { LANGUAGES } from "../../const";
const GOOGLE_TRANSLATE_API =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&dt=t&dt=bd&dj=1&text=",
  SUCCESS_RESPONSE_CODE = 200;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: {
        text: null,
        language: null
      },
      target: {
        text: null,
        language: null
      },
      loading: false,
      error: null
    };

    this.onTextLoaded = this.onTextLoaded.bind(this);
    this.onSelectSourceLanguage = this.onSelectSourceLanguage.bind(this);
    this.onSelectTargetLanguage = this.onSelectTargetLanguage.bind(this);
    this.translate = this.translate.bind(this);
    this.setError = this.setError.bind(this);
    this.clearError = this.clearError.bind(this);
    this.onTranslateSuccess = this.onTranslateSuccess.bind(this);
  }

  onTextLoaded(text) {
    if (text && text.length > 0) {
      this.setState({ source: { ...this.state.source, text } });
    }
  }

  onSelectSourceLanguage(language) {
    this.setState({ source: { ...this.state.source, language } });
    this.clearError();
  }

  onSelectTargetLanguage(language) {
    this.setState({ target: { ...this.state.target, language } });
    this.clearError();
  }

  onTranslateSuccess(text) {
    this.clearError();
    this.setState({ target: { ...this.state.target, text }, loading: false });
  }

  translate() {
    this.setState({ loading: true });
    this.clearError();
    const { source, target } = this.state;

    try {
      translateApi(
        {
          source,
          target
        },
        this.onTranslateSuccess,
        this.setError
      );
      // this.setState({ target: { ...this.state.target, text }, loading: false });
    } catch (error) {
      this.setError(error);
    }

    // axios
    //   .get(`${GOOGLE_TRANSLATE_API}{{${source.text}}}t&tl=${source.language}`)
    //   .then(res => {
    //     console.warn({ res });
    //     if (res && res.status === SUCCESS_RESPONSE_CODE) {
    //     } else this.setError(`Response failed with status: ${res.status}`);
    //   })
    //   .catch(this.setError);
  }

  setError(error) {
    this.setState({ error, loading: false });
  }

  clearError() {
    this.setState({ error: null });
  }

  render() {
    return (
      <div className="App">
        <FileInputContainer
          onTextLoaded={this.onTextLoaded}
          disabled={this.state.loading}
        />
        <SelectContainer
          options={LANGUAGES}
          className=""
          settings={{
            placeholder: "select source language",
            isSearchable: true,
            isClearable: true,
            isDisabled: !this.state.source.text || this.state.loading
          }}
          onSelect={this.onSelectSourceLanguage}
        />
        <SelectContainer
          options={LANGUAGES}
          className=""
          settings={{
            placeholder: "select target language",
            isSearchable: true,
            isClearable: true,
            isDisabled: !this.state.source.language || this.state.loading
          }}
          onSelect={this.onSelectTargetLanguage}
        />
        <ButtonContainer
          onClick={this.translate}
          disabled={!this.state.target.language || this.state.loading}
          text="translateIt!"
        />
        {this.state.loading ? <Loader /> : null}
        {this.state.error ? (
          <div className="error">{this.state.error}</div>
        ) : this.state.target.text ? (
          <div className="translatedText">
            {this.state.target.text.split("\n").map((item, key) => {
              return (
                <span className="" key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
