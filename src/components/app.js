import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom"

import Home from "./pages/home"
import Host from "./pages/host"
import Join from "./pages/join"

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      name: "",
      session: ""
    }

    this.handleUpdate = this.handleUpdate.bind(this)
  }

  handleUpdate = (target) => {
    this.setState({ [target]: event.target.value.toUpperCase() })
  }

  render() {
    return (
      <div className='app'>
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" render={props => <Home {...props} handleUpdate={this.handleUpdate} name={this.state.name} session={this.state.session} />} />
              <Route path="/host" render={props => <Host {...props} name={this.state.name} />} />
              <Route path="/join" render={props => <Join {...props} name={this.state.name} session={this.state.session} />} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
