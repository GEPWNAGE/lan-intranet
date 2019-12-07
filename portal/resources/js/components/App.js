import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Start from "./Start";
import api from '../api';
import Auth from "./Auth";
import Info from "./Info";
import logo from '../../img/logo_pacman_large10.png'
import welcome from '../../img/welcome-internet.gif'

class Main extends Component {
  constructor(props) {
    super(props);

    this.checkStatus = this.checkStatus.bind(this);
    this.handleAuth = this.handleAuth.bind(this);

    this.state = {
      state: 'start',
      tries: 0,
      data: {},
      authError: null,
      waiting: false
    };
  }
  checkStatus() {
    api.status()
      .then(data => {
        // if request = good, move to next state
        this.setState({
          state: 'loaded',
          waiting: false,
          data
        })
      })
      .catch(err => {
        if (err.status === 409) {
          // setTimeout to try this again in a bit
          let tries = this.state.tries + 1;
          this.setState({ tries });
          setTimeout(this.checkStatus, Math.min(10000 * tries, 60000));
        } else {
          // TODO: handle this?
          console.log(err);
        }
      });
  }
  handleAuth(voucher) {
    console.log(voucher);
    this.setState({ waiting: true });
    api.authenticate(voucher)
      .then(data => {
        this.setState({ state: 'start', waiting: true });
        this.checkStatus();
      })
      .catch(err => {
        this.setState({ authError: err.json.reason, waiting: false });
      });
  }
  componentDidMount() {
    this.checkStatus();
  }
  render() {
    if (this.state.waiting) {
      return <Start type="loading"/>
    }
    switch (this.state.state) {
      case 'start':
        return <Start type="details"/>;
      case 'loaded':
        if (this.state.data.authorized) {
          return (
            <div>
              <h2>Welcome to the Internet!</h2>
              <img src={welcome}/>
              <Info data={this.state.data}/>
              <a href="http://gepwnage.lan" class="btn btn-light">Continue</a>
            </div>
          );
        }
        return (
          <div>
            <Info data={this.state.data}/>
            <Auth handleAuth={this.handleAuth} error={this.state.authError}/>
          </div>
        );
    }
  }
}

export default class App extends Component {
    render() {
        return (
            <div className="App container">
              <div className="centercontainer">
                <header className="App-header">
                  <h1>
                    <img src={logo} className="logo"/>
                    GEPWNAGE
                  </h1>
                  <h2>LAN Portal</h2>
                </header>
              </div>
              <div className="centercontainer">
                <Main/>
              </div>
            </div>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
