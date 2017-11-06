import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import {App, Landing} from './';


class Routes extends Component {

  componentWillMount() {
   const { isAuthenticated } = this.props.appData;
     if (!isAuthenticated) {
       this.props.history.push('/');
       return;
      }
      this.props.history.push('/workspace');
   }
       
render() {
   const {appData} = this.props;
   return (<Switch>
            <Route exact path='/' render={() => { return <Landing /> }} />
            <Route exact path='/workspace' render={() => { return <App data={appData} /> }} />
    </Switch>);
}

}

export default withRouter(Routes);

