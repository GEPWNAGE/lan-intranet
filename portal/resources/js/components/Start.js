import React, { Component } from 'react';
import beer from '../../img/logo_beer.svg';

export default class Start extends Component {
  render() {
    return (
      <div className="text-center">
        <p>
          Loading your data.
        </p>
        <img src={beer} className='spin-img mx-auto d-block'/>
        <p>
          Please wait a minute.
        </p>
        <p>
          If this takes more then a few minutes, please contact someone from GEPWNAGE.
        </p>
      </div>
    );
  }
}