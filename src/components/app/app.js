import React from "react";
import "./app.css";
import FileInputContainer from "../input/file-input-container";
import SelectContainer from "../select/select-container";
import ButtonContainer from "../button/button-container";
import Loader from "../loader/loader";

const LANGUAGES = [
  { value: "EN", label: "EN󠁧󠁢" },
  { value: "IT", label: "IT" },
  { value: "FR", label: "FR" },
  { value: "DE", label: "DE" },
  { value: "RUS", label: "RUS" }
];

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
      loading: false
    };

    this.onTextLoaded = this.onTextLoaded.bind(this);
    this.onSelectSourceLanguage = this.onSelectSourceLanguage.bind(this);
    this.onSelectTargetLanguage = this.onSelectTargetLanguage.bind(this);
    this.translate = this.translate.bind(this);
  }

  onTextLoaded(text) {
    if (text && text.length > 0) {
      this.setState({ source: { ...this.state.source, text } });
    }
  }

  onSelectSourceLanguage(language) {
    this.setState({ source: { ...this.state.source, language } });
  }

  onSelectTargetLanguage(language) {
    this.setState({ target: { ...this.state.target, language } });
  }

  translate() {
    this.setState({ loading: true });
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
        {this.state.target.text ? (
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
