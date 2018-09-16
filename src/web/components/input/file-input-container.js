import React from "react";

const ACCEPTED_FILE_EXTENSIONS = ".txt";

class FileInputContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      error: null
    };

    this.uploadFile = this.uploadFile.bind(this);
    this.readFile = this.readFile.bind(this);
    this.onTextLoaded = this.onTextLoaded.bind(this);
  }

  uploadFile(event) {
    this.setState({
      error: null,
      selected: null
    });
    let file = event.target.files[0];

    if (file) {
      if (
        ACCEPTED_FILE_EXTENSIONS.includes(this.parseFileExtension(file.name))
      ) {
        this.setState({ selected: file.name });
        let data = new FormData();
        data.append("file", file);

        this.readFile(file);
      } else {
        this.setState({
          error: {
            message: `Incorrect file extension!\r\nOnly [${ACCEPTED_FILE_EXTENSIONS}] is allowed.`
          }
        });
        console.error("Incorrect file extension!");
      }
    } else {
      this.setState({ error: { message: "Incorrect file!" } });
      console.error("Incorrect file!");
    }
  }

  readFile(file) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    })
      .then(text => this.onTextLoaded(text))
      .catch(error => {
        this.setState({ error });
        console.error({ error });
      });
  }

  parseFileExtension(filename) {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  }

  onTextLoaded(text) {
    this.props.onTextLoaded(text);
  }

  render() {
    return (
      <div class="file-upload">
        {this.state.error ? (
          <div className={`${this.props.className} error`}>
            {this.state.error.message.split("\r\n").map((item, key) => {
              return (
                <span key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </div>
        ) : null}
        <label for="upload" class="file-upload__label">
          {this.state.selected ? this.state.selected : "Select file"}
        </label>
        <input
          id="upload"
          className="file-upload__input"
          type="file"
          name="file-upload"
          onChange={this.uploadFile}
          accept={ACCEPTED_FILE_EXTENSIONS}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

export default FileInputContainer;
