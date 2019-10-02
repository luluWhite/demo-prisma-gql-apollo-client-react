import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, withRouter } from 'react-router-dom';

import { rls } from '../constants/routesNlinks';
import { storageStr } from '../constants/storageConst';

const initAuth = {
    [storageStr.utk]: ''
}

const AppNavbars = ({
    history,
    match
}) => {
    const [AuthToken, setAuthToken] = useState(initAuth)

    useEffect(() => {
        setAuthToken({
            ...AuthToken,
            [storageStr.utk]: localStorage.getItem(storageStr.utk)
        })
        // return () => {cleanup};
    }, [localStorage[storageStr.utk]])

    const handleLogout = () => {
        localStorage.removeItem(storageStr.utk);
        history.push(rls.landing)
    }

    return (
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Navbar.Brand to={rls.landing}>React-Bootstrap-Prisma</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavLink className="nav-link" to={rls.landing} exact>
                        Courses
                    </NavLink>
                    <NavLink className="nav-link" to={rls.custQuery}>
                        Custom Client Query
                    </NavLink>
                    <NavLink className="nav-link" to={rls.sc}>
                        Search Courses
                    </NavLink>
                    {console.log('49 -- AuthToken[storageStr.utk]: ', AuthToken[storageStr.utk])}
                    {
                        AuthToken[storageStr.utk] && <NavLink className="nav-link" to={rls.cc}>Create Course</NavLink>
                    }
                    {/* <NavLink className="nav-link" to={rls.editCourse}>Edit Course</NavLink> */}
                    <NavDropdown title="User Auth">
                        {
                            AuthToken[storageStr.utk] ?
                                <NavDropdown.Item
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </NavDropdown.Item>
                                : (<>
                                    <NavLink className="dropdown-item" to={rls.su}>Sign Up</NavLink>
                                    <NavLink className="dropdown-item" to={rls.li}>Log In</NavLink>
                                </>)
                        }
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

AppNavbars.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
}

export default withRouter(AppNavbars);
