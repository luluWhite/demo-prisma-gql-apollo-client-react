import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withApollo } from 'react-apollo';

import { SEARCH_COURSES } from '../graphQL/queries';
import { OptNames } from '../constants/gqlOptNames';
import ErrMsg from '../shared/ErrorMessage';
import Spinner from '../shared/Spinner';

const initSearchTerm = '';
const initCourseAndLoading = {
    courses: [],
    isLoading: false
}

const SearchCourses = ({
    client
}) => {
    const [scFormValue, setScFormValue] = useState(initSearchTerm);
    const [courseLoading, setCourseLoading] = useState(initCourseAndLoading);

    const handleScChange = (e) => {
        const { name, value } = e.target;
        setScFormValue(value);
    }

    const handleScSubmit = async (e) => {
        e.preventDefault();
        setCourseLoading({
            ...courseLoading,
            isLoading: true
        });
        const {data} = await client.query({
            query: SEARCH_COURSES,
            variables: {
                filter: scFormValue
            }
        });
        setCourseLoading({
            courses: data[OptNames.courses].courses,
            isLoading: false
        });
    }


    return (
        <Container fluid={true}>
            <Row>
                <Col
                    xs={{ span: 10, offset: 1 }}
                    md={{ span: 6, offset: 3 }}
                    lg={{ span: 4, offset: 4 }}
                >
                    <Form
                        noValidate
                        name="SearchCourseForm"
                        onSubmit={handleScSubmit}
                    >
                        <Form.Row>
                            <Form.Group as={Col} md="9" controlId="scfNameOrDesc">
                                <Form.Label>Word in Name or Description</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Word in Name or Description"
                                    name="filter"
                                    value={scFormValue}
                                    onChange={handleScChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Pls input search term...
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="3" controlId="scfButton">
                                <Button
                                    type="submit"
                                    className="mt-4"
                                >
                                    Search
                                </Button>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                    {courseLoading.isLoading && <Spinner />}
                    {(courseLoading.courses && courseLoading.courses.length > 0)
                        ? courseLoading.courses.map((el, idx) => (
                            <div className="card container" key={`${idx}_${el.id}`}>
                                <div className="card-body">
                                    <h5 className="card-title">{el.name}</h5>
                                    <p className="card-text"> {el.description} </p>
                                </div>
                            </div>
                        ))
                        : (<div>
                            Please do search first...
                        </div>)}
                </Col>
            </Row>
        </Container>
    )
}

SearchCourses.propTypes = {
    client: PropTypes.object.isRequired
}

export default withApollo(SearchCourses);
