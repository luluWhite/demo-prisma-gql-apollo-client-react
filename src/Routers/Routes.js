import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
/**
 * use react-router-auth, but usually, u should write it by urself
 */
import { AuthRoute, UnauthRoute } from 'react-router-auth';

import { rls } from '../constants/routesNlinks';
import WithSession from '../shared/WithSession';
import { storageStr } from '../constants/storageConst';
import Authen from '../shared/Auth';
import Courses from '../containers/Courses';
import CreateCourse from '../containers/createCourse';
import CustClientQuery from '../components/customApolloRender';
import EditCourse from '../containers/EditCourse';
import SearchCourses from '../containers/SearchCourses';
import NoFoundCompo from '../shared/NoFound';

const initAuthenToken = localStorage.getItem(storageStr.utk) ? true : false;

const Routes = ({
    history,
    match
}) => {
    const [isAuth, setIsAuth] = useState(initAuthenToken);
    useEffect(() => {
        console.log('29 in Routes.js -- user token: ', localStorage.getItem(storageStr.utk))
        setIsAuth(localStorage.getItem(storageStr.utk) ? true : false);
        // return () => { cleanup };
    }, [localStorage.getItem(storageStr.utk)])

    /**
     * here are 2 issues
     * 1. Apollo client setting for Authorization may not be set correctly
     * 2. Authentication Token would be wrong, so Auth and Unauth route dosen't work
     */
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
            {/* <Route
                path={rls.su}
                component={Authen}
            />
            <Route
                path={rls.li}
                component={Authen}
            />
            <Route
                path={rls.cc}
                component={CreateCourse}
            />
            <Route exact
                path={rls.editCourse}
                component={EditCourse}
            /> */}
            <Route component={NoFoundCompo} />
        </Switch>
    )
}

Routes.propTypes = {};

export default WithSession(Routes);
