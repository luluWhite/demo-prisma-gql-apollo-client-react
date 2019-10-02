import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
/**
 * use react-router-auth, but usually, u should write it by urself
 */
import { AuthRoute, UnauthRoute } from 'react-router-auth';

import { rls } from '../constants/routesNlinks';
import { storageStr } from '../constants/storageConst';
import Authen from '../shared/Auth';
import Courses from '../containers/Courses';
import CreateCourse from '../containers/createCourse';
import CustClientQuery from '../components/customApolloRender';
import EditCourse from '../containers/EditCourse';
import SearchCourses from '../containers/SearchCourses';
import NoFoundCompo from '../shared/NoFound';

class Routes extends Component {
    /* constructor(props) {
        super(props)
        this.state = {
            isAuth: false
        }
    } */

    render() {
        const isAuth = localStorage.getItem(storageStr.utk) ? true : false;
        console.log('29 -- isAuth: ', isAuth)
        // need modify Routes, it require refresh manully to see page
        return (
            <Switch>
                <Route exact
                    path={rls.landing}
                    component={Courses}
                />
                <Route
                    path={rls.custQuery}
                    component={CustClientQuery}
                />
                <Route
                    path={rls.sc}
                    component={SearchCourses}
                />
                <UnauthRoute
                    path={rls.su}
                    component={Authen}
                    redirectTo={rls.landing}
                    authenticated={isAuth}
                />
                <UnauthRoute
                    path={rls.li}
                    component={Authen}
                    redirectTo={rls.landing}
                    authenticated={isAuth}
                />
                <AuthRoute
                    path={rls.cc}
                    component={CreateCourse}
                    redirectTo={rls.li}
                    authenticated={isAuth}
                />
                <AuthRoute exact
                    path={rls.editCourse}
                    component={EditCourse}
                    redirectTo={rls.li}
                    authenticated={isAuth}
                />
                <Route component={NoFoundCompo} />
            </Switch>
        )
    }
}

export default Routes;
