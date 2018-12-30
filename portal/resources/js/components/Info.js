import React, { Component } from 'react';

export default class Info extends Component {
  getBody() {
    let ret = [];
    for (let key in this.props.data) {
      if (key === 'ip' || key === 'mac') {
        ret.push(<tr key={key}>
          <td>{key}</td>
          <td>{this.props.data[key]}</td>
        </tr>);
      }
    }
    return ret;
  }
  render() {
    return (
      <table>
        <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        {this.getBody()}
        </tbody>
      </table>
    )
  }
}
