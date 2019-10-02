import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Mutation } from 'react-apollo';

import { SIGNUP_USER, LOGIN_USER } from '../graphQL/mutations';
import { rls } from '../constants/routesNlinks';
import { OptNames } from '../constants/gqlOptNames';
import ErrMsg from '../shared/ErrorMessage';
import Spinner from '../shared/Spinner';
import { storageStr } from '../constants/storageConst';

class Authen extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            loginStatus: false //check the route of the app it should be login or signup
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { path } = props.match;
        if (path === rls.li) {
            return { loginStatus: true };
        } else {
            return { loginStatus: false };
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            [name]: value
        }))
    }

    submitUser = async (e, authMutate) => {
        e.preventDefault();
        const authResults = await authMutate();
        if (this.state.loginStatus) {
            localStorage.setItem(storageStr.utk, authResults.data[OptNames.li].token);
        } else {
            localStorage.setItem(storageStr.utk, authResults.data[OptNames.su].token);
        }
        this.props.history.push(rls.landing)
    }

    render() {
        const { email, password, loginStatus } = this.state;
        return (
            <Container fluid={true}>
                <Row>
                    <Col
                        xs={{ span: 10, offset: 1 }}
                        sm={{ span: 10, offset: 1 }}
                        md={{ span: 6, offset: 3 }}
                        lg={{ span: 4, offset: 4 }}
                    >
                        <legend>
                            {loginStatus ? 'Log In(latin@yan.bede)' : 'Sign Up'}
                        </legend>
                        <Mutation
                            mutation={loginStatus ? LOGIN_USER : SIGNUP_USER}
                            variables={{
                                data: {
                                    email,
                                    password
                                }
                            }}
                        >
                            {(authMutate, { data, loading, error }) => {
                                if (loading) return <Spinner />
                                if (error) return <ErrMsg error={error} />
                                return (
                                    <Form
                                        name="AuthForm"
                                        noValidate
                                        onSubmit={(event) => {
                                            this.submitUser(event, authMutate)
                                        }}
                                    >
                                        <Form.Group controlId="AuthFormGroupEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                name="email"
                                                value={email ? email : ''}
                                                onChange={this.handleChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Input Email...
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group controlId="AuthFormGroupPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                name="password"
                                                value={password ? password : ''}
                                                onChange={this.handleChange}
                                            />
                                        </Form.Group>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                        >
                                            {loginStatus ? 'Log In' : 'Sign Up'}
                                        </Button>
                                    </Form>
                                )
                            }}
                        </Mutation>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Authen;
