import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Start from "./Start";
import api from '../api';

class Main extends Component {
  constructor(props) {
    super(props);

    this.checkStart = this.checkStart.bind(this);

    this.state = {
      state: 'start',
      tries: 0
    };
  }
  checkStart() {
    api.status().then(data => {
      if (data.mac !== undefined) {
        // if request = good, move to next state
        this.setState({
          state: 'auth',
          startData: data
        })
      } else {
        // otherwise, setTimeout to try this again
        let tries = this.state.tries + 1
        this.setState({ tries });
        setTimeout(this.checkStart, Math.min(10000 * tries, 60000));
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
        return <div>TODO auth</div>;
      case 'status':
        return <div>TODO status</div>
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
