import React from "react";

const ACCEPTED_FILE_EXTENSIONS = ".txt";

class FileInputContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null,
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
      // axios.post('/files', data)...
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
    this.setState({ text });
  }

  render() {
    return (
      <span>
        <div>
          <input
            type="file"
            name="myFile"
            onChange={this.uploadFile}
            accept={ACCEPTED_FILE_EXTENSIONS}
            disabled={this.props.disabled}
          />
        </div>

        {this.state.error ? (
          <div className="error">{this.state.error.message}</div>
        ) : this.state.text ? (
          <div>
            {/* @TODO: change to textarea */}
            {this.state.text.split("\n").map((item, key) => {
              return (
                <span className="" key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </div>
        ) : null}
      </span>
    );
  }
}

export default FileInputContainer;
