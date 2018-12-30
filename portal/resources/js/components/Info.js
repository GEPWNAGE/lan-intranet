import React, { Component } from 'react';

export default class Info extends Component {
  getBody() {
    let ret = [];
    for (let key in this.props.data) {
      if (key === 'ip' || key === 'mac') {
        ret.push(<tr key={key}>
          <td><strong>{key}</strong></td>
          <td>{this.props.data[key]}</td>
        </tr>);
      }
    }
    return ret;
  }
  render() {
    return (
      <table>
        <tbody>
        {this.getBody()}
        </tbody>
      </table>
    )
  }
}
