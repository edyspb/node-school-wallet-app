import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {App, 
      Landing} from './';


const Routes = ({ appData }) => {
	return (<Switch>
		<Route exact path='/' render={() => { return <Landing /> }} />
        <Route exact path='/workspace' render={() => { return <App data={appData} /> }} />
</Switch>)};

export default Routes;

