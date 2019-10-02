import React from 'react';
import { storageStr } from '../constants/storageConst';

const WithSession = Component => (props) => {
    console.log('5 -- props: ', props, localStorage.getItem(storageStr.utk))
    return (
        <Component {...props}
            userSession={localStorage.getItem(storageStr.utk) ? true : false}
        />
    )
}

export default WithSession;
