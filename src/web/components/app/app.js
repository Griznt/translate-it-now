import React from "react";
import "./app.css";
import FileInputContainer from "../input/file-input-container";
import SelectContainer from "../select/select-container";
import ButtonContainer from "../button/button-container";
import Loader from "../loader/loader";
import { translate as translateApi } from "../../axios/translate";
import { LANGUAGES } from "../../const";

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
    } catch (error) {
      this.setError(error);
    }
  }

  setError(error) {
    this.setState({ error, loading: false });
  }

  clearError() {
    this.setState({ error: null });
  }

  render() {
    return (
      <div className="app">
        <span className="logo-text">TRANSLATE IT! APP</span>

        <div className="sidebar-left">
          <FileInputContainer
            className="source-text-load"
            onTextLoaded={this.onTextLoaded}
            disabled={this.state.loading}
          />
          <SelectContainer
            options={LANGUAGES}
            className="language"
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
            className="language"
            settings={{
              placeholder: "select target language",
              isSearchable: true,
              isClearable: true,
              isDisabled: !this.state.source.language || this.state.loading
            }}
            onSelect={this.onSelectTargetLanguage}
          />
          <ButtonContainer
            className="translate"
            onClick={this.translate}
            disabled={!this.state.target.language || this.state.loading}
            text="translateIt!"
          />
        </div>
        <div className="text-block">
          {this.state.loading ? <Loader /> : null}
          {this.state.source.text ? (
            <div className="source-text">
              <span className="header">Source text</span>
              {/* @TODO: change to textarea */}
              {this.state.source.text.split("\n").map((item, key) => {
                return (
                  <div className="sentence" key={key}>
                    <span className="source">{item}</span>
                    <br />
                  </div>
                );
              })}
            </div>
          ) : null}
          {this.state.error ? (
            <div className="error">{this.state.error}</div>
          ) : this.state.target.text ? (
            <div className="target-text">
              <span className="header">Translated text:</span>
              {this.state.target.text.map((item, key) => {
                return (
                  <div className="sentence" key={key}>
                    <span className="source">{item.source}</span>
                    <br />
                    <span className="target">{item.target}</span>

                    <br />
                    <br />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default App;
