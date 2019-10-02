import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Mutation } from 'react-apollo';

import { CREATE_COURSE } from '../graphQL/mutations';
import { GET_COURSES_WITH_PAGINATION_AND_FILTER } from '../graphQL/queries';
import { rls } from '../constants/routesNlinks';
import Spinner from '../shared/Spinner';
import ErrMsg from '../shared/ErrorMessage';
import { OptNames } from '../constants/gqlOptNames';
import { variables } from '../constants/commonArgs';

const initCreateCourseForm = {
    name: '',
    description: '',
    isPublished: false
}

const CreateCourse = ({
    history,
    match
}) => {
    const [ccForm, setCcForm] = useState(initCreateCourseForm);

    const handleCcFormChange = (e) => {
        const { name, value, checked } = e.target;
        setCcForm({
            ...ccForm,
            [name]: name === 'isPublished'
                ? checked : value
        })
    };

    /* const handleCcSubmit = (e, createCourse) => {
        e.preventDefault();
        createCourse()
            .then(({ data }) => {
                console.log('31 -- data: ', data)
            })
            .catch((err) => {
                console.log('34 -- err: ', err)
            });
    } */

    const afterCreateUpdateCachedData = (cache, { data: { createCourse } }) => {
        const { courses } = cache.readQuery({
            query: GET_COURSES_WITH_PAGINATION_AND_FILTER,
            variables
        });
        console.log('54 createCourse update -- courses: ', courses, createCourse)
        cache.writeQuery({
            query: GET_COURSES_WITH_PAGINATION_AND_FILTER,
            data: {
                courses: {
                    ...courses,
                    courses: [createCourse, ...courses[OptNames.courses]]
                }
            }
        })
    }

    return (
        <Container fluid={true}>
            <Card>
                <Card.Title>
                    Create Course
                </Card.Title>
                <Card.Body>
                    <Mutation
                        mutation={CREATE_COURSE}
                        // variables={{
                        // data: { ...ccForm }
                        // }}
                        update={(cache, { data: { createCourse } }) => {
                            const { courses } = cache.readQuery({
                                query: GET_COURSES_WITH_PAGINATION_AND_FILTER,
                                variables
                            });
                            console.log('83 createCourse update -- courses: ', courses, createCourse)
                            cache.writeQuery({
                                query: GET_COURSES_WITH_PAGINATION_AND_FILTER,
                                data: {
                                    courses: {
                                        ...courses,
                                        courses: [createCourse, ...courses[OptNames.courses]]
                                    }
                                }
                            })
                            {/* if (createCourse.isPublished) {
                            } */}
                        }}
                        onCompleted={() => {
                            setCcForm(initCreateCourseForm);
                            history.push(rls.landing)
                        }}
                    >
                        {(createCourse, { data, loading, error }) => {
                            if (loading) return <Spinner />
                            if (error) return <ErrMsg error={error} />
                            return (
                                <Form
                                    name="CreateCourseForm"
                                    noValidate
                                    // onSubmit={(event) => {
                                    // handleCcSubmit(event, createCourse)
                                    // }}
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        await createCourse({
                                            variables: {
                                                data: { ...ccForm }
                                            }
                                        })
                                    }}
                                >
                                    <Form.Group controlId="ccNameGroup">
                                        <Form.Label>Course Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={ccForm.name}
                                            placeholder="Enter Course Name"
                                            onChange={handleCcFormChange}
                                        />
                                        <Form.Text className="text-muted">
                                            input Course Name
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="ccDescriptionGroup">
                                        <Form.Label>Course Description</Form.Label>
                                        <Form.Control
                                            as="textarea" rows="3"
                                            name="description"
                                            value={ccForm.description}
                                            placeholder="Enter Course Description"
                                            onChange={handleCcFormChange}
                                        />
                                        <Form.Text className="text-muted">
                                            input Course Description
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="ccIsPublished">
                                        <Form.Check
                                            type="checkbox"
                                            label="Is Published"
                                            name="isPublished"
                                            onChange={handleCcFormChange}
                                            checked={ccForm.isPublished}
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit">
                                        Create
                                    </Button>
                                </Form>
                            )
                        }}
                    </Mutation>
                </Card.Body>
            </Card>
        </Container>
    )
}

CreateCourse.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default CreateCourse;
