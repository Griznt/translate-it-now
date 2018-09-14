import React from "react";

class ButtonContainer extends React.Component {
  render() {
    return (
      <button
        className={this.props}
        value={this.props.initialValue}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        {this.props.text}
        {this.props.children ? this.props.children : null}
      </button>
    );
  }
}

export default ButtonContainer;
