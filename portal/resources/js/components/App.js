import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Start from "./Start";

class Main extends Component {
  constructor(props) {
    super(props);

    this.handleStart = this.handleStart.bind(this);

    this.state = {
      state: 'start'
    };
  }
  handleStart() {
    this.setState({
      state: 'auth'
    })
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
