import React, { Component } from 'react';
import beer from '../../img/logo_beer.svg';

export default class Start extends Component {
  render() {
    if (this.props.type == 'loading') {
      return (
        <div className="text-center">
          <img src={beer} className='spin-img mx-auto d-block'/>
        </div>
      );
    }
    return (
      <div className="text-center">
        <img src={beer} className='spin-img mx-auto d-block'/>
        <h4>
          Loading your client details
        </h4>
        <p>
          If this takes more than a few minutes,<br/> please contact someone from GEPWNAGE.
        </p>
      </div>
    );
  }
}
