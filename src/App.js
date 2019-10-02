import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as BrRouter } from 'react-router-dom';

import AppNavbars from './Routers/Navbars';
import AppRoutes from './Routers/Routes';

const App = () => {
	return (
		<BrRouter>
			<AppNavbars />
			<AppRoutes />
		</BrRouter>
	)
}

App.propTypes = {};

export default App;
