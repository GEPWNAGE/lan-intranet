import React, { Component } from 'react';

export default class Start extends Component {
  render() {
    return (
      <div>
        Status
        <button onClick={this.props.handleStart}>next</button>
      </div>
    );
  }
}