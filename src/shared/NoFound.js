import React from 'react';
import { Link } from 'react-router-dom';

const NoFoundCompo = () => {
	return (
		<div>
			<h1>
				404 No Found.
			</h1>
			<Link to="/">
				Go Home
			</Link>
		</div>
	);
};

export default NoFoundCompo;
