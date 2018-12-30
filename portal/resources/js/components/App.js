import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Start from "./Start";
import api from '../api';
import Auth from "./Auth";
import Info from "./Info";

class Main extends Component {
  constructor(props) {
    super(props);

    this.checkStart = this.checkStart.bind(this);

    this.state = {
      state: 'start',
      tries: 0,
      startData: {},
      statusData: {}
    };
  }
  checkStart() {
    api.status()
      .then(data => {
        // if request = good, move to next state
        this.setState({
          state: 'auth',
          startData: data
        })
      })
      .catch(err => {
        if (err.status === 409) {
          // setTimeout to try this again in a bit
          let tries = this.state.tries + 1;
          this.setState({ tries });
          setTimeout(this.checkStart, Math.min(10000 * tries, 60000));
        } else {
          // TODO: handle this?
          console.log(err);
        }
      });
  }
  componentDidMount() {
    this.checkStart();
  }
  render() {
    switch (this.state.state) {
      case 'start':
        return <Start handleStart={this.handleStart}/>;
      case 'auth':
        return (
          <div>
            <Info data={this.state.startData}/>
            <Auth/>
          </div>
        );
      case 'status':
        return (
          <div>
            <Info data={this.state.statusData}/>
            TODO status
          </div>
        );
    }
  }
}

export default class App extends Component {
    render() {
        return (
            <div className="App">
              <header className="App-header">
                <h1>GEPWNAGE LAN Portal</h1>
              </header>
              <Main/>
            </div>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
