import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import Cookies from 'universal-cookie';

import {App, Landing} from './';


class Routes extends Component {

  constructor(props) {
    super(props);
    this.singOut = this.singOut.bind(this);
  }

  componentWillMount() {
   const { isAuthenticated } = this.props.appData;
     if (!isAuthenticated) {
       this.props.history.push('/');
       return;
      }
      this.props.history.push('/workspace');
   }

   singOut() {
    const cookies = new Cookies();
    cookies.set('accessToken', undefined);
    this.props.history.push('/');
   }
       
  render() {
     const {appData} = this.props;
     return (<Switch>
              <Route exact path='/' render={() => { return <Landing /> }} />
              <Route exact path='/workspace' render={() => { return <App data={appData} singOut={this.singOut} /> }} />
      </Switch>);
  }

}

export default withRouter(Routes);

