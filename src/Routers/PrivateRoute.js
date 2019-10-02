import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Route, Redirect } from 'react-router-dom';

import { GET_CURRENT_USER } from '../graphQL/queries';
import { gOptNames } from '../constants/gqlOptNames';
import { RouteLinks } from '../constants/routeLinksStatements';
import Spinner from '../shared/Spinner';

const PrivateRoute = ({
    component: Component,
    ...rest
}) => {
    return (
        <Query
            query={GET_CURRENT_USER}
        >
            {({ data, loading, error }) => {
                if (loading) return <Spinner />
                return (
                    <Route {...rest}
                        component={(props) => (
                            !data[gOptNames.gcu]
                                ? <Redirect to={RouteLinks.initLanding} />
                                : <Component
                                    userSession={{
                                        ...data[gOptNames.gcu],
                                        match: props.match.url
                                    }}
                                />
                        )}
                    />
                );
            }}
        </Query>
    )
}

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired
}

export default PrivateRoute;
