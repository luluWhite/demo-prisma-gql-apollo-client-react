import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ error }) => {
    console.log('5 -- error message: ', error)
    return (
        <p className="error-text">{error.message.includes(':')
            ? error.message.split(':').pop()
            : error.message}</p>
    )
}

ErrorMessage.propTypes = {
    error: PropTypes.object.isRequired
}

export default ErrorMessage;
