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
    this.props.handleAuth(this.state.voucher);
    e.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Voucher</h2>
        <input type="text" name="voucher" placeholder="Voucher" onChange={this.handleVoucher}/>
        <button>Sign in</button>
      </form>
    )
  }
}
