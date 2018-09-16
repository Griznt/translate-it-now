import React from "react";
import "../../css/main.css";
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
        collapsed: false,
        text: null,
        language: null,
        filename: null,
        extension: null
      },
      target: {
        text: null,
        language: null
      },
      loading: false,
      error: null,
      translateHighlighted: true
    };

    this.onTextLoaded = this.onTextLoaded.bind(this);
    this.onSelectSourceLanguage = this.onSelectSourceLanguage.bind(this);
    this.onSelectTargetLanguage = this.onSelectTargetLanguage.bind(this);
    this.translate = this.translate.bind(this);
    this.setError = this.setError.bind(this);
    this.clearError = this.clearError.bind(this);
    this.onTranslateSuccess = this.onTranslateSuccess.bind(this);
    this.toggleSourceText = this.toggleSourceText.bind(this);
    this.toggleHighlight = this.toggleHighlight.bind(this);
    this.getParsedLanguages = this.getParsedLanguages.bind(this);
    this.saveResults = this.saveResults.bind(this);
  }

  onTextLoaded({ text, filename, extension }) {
    if (text && text.length > 0) {
      this.setState({
        source: {
          ...this.state.source,
          text,
          filename,
          extension
        }
      });
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
    this.setState({
      target: { ...this.state.target, text },
      loading: false,
      source: { ...this.state.source, collapsed: true }
    });
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

  toggleSourceText() {
    this.setState({
      source: {
        ...this.state.source,
        collapsed: !this.state.source.collapsed
      }
    });
  }

  toggleHighlight() {
    this.setState({ translateHighlighted: !this.state.translateHighlighted });
  }

  getParsedLanguages() {
    return Object.keys(LANGUAGES).map(key => {
      return { value: key, label: LANGUAGES[key] };
    });
  }

  saveResults() {
    const element = document.createElement("a");
    const fileToDownload = this.state.target.text.map(sentence => {
      return `${sentence.source}\r\n${sentence.target}\r\n\r\n`;
    });
    const file = new Blob(fileToDownload, {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = `${this.state.source.filename}_${
      this.state.source.language.value
    }_to_${this.state.target.language.value}.${
      this.state.source.extension ? this.state.source.extension : ""
    }`;
    element.click();
  }

  render() {
    const languages = this.getParsedLanguages();
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
            options={languages}
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
            options={languages}
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
          <div className="highlight-switcher" onClick={this.toggleHighlight}>
            <span className="label">Highlight translated sentences</span>
            <div className="checkbox">
              <input
                type="checkbox"
                checked={this.state.translateHighlighted}
                onChange={this.toggleHighlight}
              />
              <span />
            </div>
          </div>
          <ButtonContainer
            className="save"
            onClick={this.saveResults}
            disabled={!this.state.target.text || this.state.loading}
            text="save results"
          />
        </div>
        <div className="text-block">
          {this.state.loading ? <Loader className="loader" /> : null}
          {this.state.source.text ? (
            <div
              className={`source-text${
                this.state.source.collapsed ? " collapsed" : ""
              }`}
            >
              <div className="header" onClick={this.toggleSourceText}>
                Source text
              </div>
              {/* @TODO: change to textarea */}
              <div className="content">
                {this.state.source.text.split("\n").map((item, key) => {
                  return (
                    <div className="sentence" key={key}>
                      <span className="source">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {this.state.error ? (
            <div className="error">{this.state.error}</div>
          ) : this.state.target.text ? (
            <div
              className={`target-text${
                this.state.source.collapsed ? " extended" : ""
              }`}
            >
              <div className="header">Translated text</div>
              <div
                className={`content${
                  this.state.source.collapsed ? " extended" : ""
                }`}
              >
                {this.state.target.text.map((item, key) => {
                  return (
                    <div className="sentence" key={key}>
                      <span className="source">{item.source}</span>
                      <span
                        className={`target${
                          this.state.translateHighlighted ? " highlighted" : ""
                        }`}
                      >
                        {item.target}
                      </span>
                      <br />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default App;
