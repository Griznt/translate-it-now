import React from "react";

const ACCEPTED_FILE_EXTENSIONS = ".txt";

class FileInputContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };

    this.uploadFile = this.uploadFile.bind(this);
    this.readFile = this.readFile.bind(this);
    this.onTextLoaded = this.onTextLoaded.bind(this);
  }

  uploadFile(event) {
    let file = event.target.files[0];

    if (file) {
      let data = new FormData();
      data.append("file", file);

      this.readFile(file);
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

  onTextLoaded(text) {
    this.props.onTextLoaded(text);
  }

  render() {
    return (
      <div class="file-upload">
        <label for="upload" class="file-upload__label">
          Select file
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
        {this.state.error ? (
          <div className={`${this.props.className} error`}>
            {this.state.error.message}
          </div>
        ) : null}
      </div>
    );
  }
}

export default FileInputContainer;
