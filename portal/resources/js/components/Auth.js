import React, { Component } from 'react';

export default class Auth extends Component {
  constructor(props) {
    super(props);

    this.handleVoucher = this.handleVoucher.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      voucher: ''
    }
  }
  handleVoucher(e) {
    this.setState({ voucher: e.target.value });
  }
  handleSubmit(e) {
    console.log(this.state.voucher);
    e.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="voucher" onChange={this.handleVoucher}/>
        <button>Submit</button>
      </form>
    )
  }
}
