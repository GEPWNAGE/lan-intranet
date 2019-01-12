import React, { Component } from 'react';

export default class Info extends Component {
  getBody() {
    let ret = [];
    console.log(this.props.data);
    for (let key in this.props.data) {
      if (key === 'ip' || key === 'mac') {
        ret.push(<tr key={key}>
          <td className="left"><strong>{key.toUpperCase()}</strong></td>
          <td className="right">{this.props.data[key]}</td>
        </tr>);
      }
    }
    return ret;
  }
  render() {
    return (
      <div className="maininfo">
        <h4>Client details</h4>
        <table className="info">
          <tbody>
          {this.getBody()}
          </tbody>
        </table>
      </div>
    )
  }
}
