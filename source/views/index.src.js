import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {hydrate as reactHydrate} from 'react-dom';
import {hydrate as emotionHydrate} from 'emotion';
import {Routes} from '../client/components';

const {ids, appData} = window.__data;

emotionHydrate(ids);

const Routing = (<Router>
	<Routes appData={appData} />
</Router>);
reactHydrate(Routing, document.getElementById('root'));
