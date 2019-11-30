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
    let error = '';
    let classNames = 'form-control';
    if (this.props.error !== null) {
      error = <div className="invalid-feedback">{this.props.error}</div>;
      classNames += ' is-invalid';
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Voucher</h2>
        <div className="form-group">
          <label htmlFor="voucher">Please enter your voucher below<br/>
            to get access to the internet.</label>
          <input type="text" id="voucher" placeholder="Voucher" onChange={this.handleVoucher} className={classNames}/>
          {error}
        </div>
        <button type="submit" className="btn btn-light">Sign in</button>
      </form>
    )
  }
}
