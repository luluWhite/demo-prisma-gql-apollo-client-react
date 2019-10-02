import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { rls } from '../constants/routesNlinks';
import { GET_COURSE_VIA_ID } from '../graphQL/queries';
import { UPDATE_COURSE } from '../graphQL/mutations';
import Spinner from '../shared/Spinner';
import ErrMsg from '../shared/ErrorMessage';

const initUpdateCourseForm = {
    name: '',
    description: '',
    // isPublished: false
}

const EditCourse = ({
    history,
    match,
    location
}) => {
    const [ucForm, setUcForm] = useState(initUpdateCourseForm);

    const handleUcFormChange = (e) => {
        const { name, value, checked } = e.target;
        setUcForm({
            ...ucForm,
            [name]: name === 'isPublished'
                ? checked : value
        })
    };

    const handleUcSubmit = async (updateCourse, e) => {
        e.preventDefault();
        await updateCourse();
    }

    return (
        <Query
            query={GET_COURSE_VIA_ID}
            variables={{
                where: { id: match.params.id }
            }}
        >
            {({ data }, loading, error) => {
                console.log('48 -- loading: ', loading)
                console.log('49 -- error: ', error)
                if (loading) return <Spinner />
                if (error) return <ErrMsg error={error} />
                if (!data) return <Spinner />
                const { course } = data;
                console.log('52 -- course: ', course)
                return (
                    <Mutation
                        mutation={UPDATE_COURSE}
                        variables={{
                            data: { ...ucForm },
                            where: { id: match.params.id }
                        }}
                        onCompleted={() => {
                            setUcForm(initUpdateCourseForm);
                            history.push(rls.landing)
                        }}
                    >
                        {(updateCourse, { data, loading, error }) => {
                            return (
                                <Form
                                    name="UpdateCourseForm"
                                    noValidate
                                    onSubmit={(event) => {
                                        handleUcSubmit(updateCourse, event)
                                    }}
                                >
                                    <Form.Group controlId="ucNameGroup">
                                        <Form.Label>Course Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            // value={ucForm.name}
                                            defaultValue={course.name}
                                            placeholder="Enter Course Name"
                                            onChange={handleUcFormChange}
                                        />
                                        <Form.Text className="text-muted">
                                            change Course Name
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="ucDescriptionGroup">
                                        <Form.Label>Course Description</Form.Label>
                                        <Form.Control
                                            as="textarea" rows="3"
                                            name="description"
                                            // value={ucForm.description}
                                            defaultValue={course.description}
                                            placeholder="Enter Course Description"
                                            onChange={handleUcFormChange}
                                        />
                                        <Form.Text className="text-muted">
                                            change Course Description
                                        </Form.Text>
                                    </Form.Group>
                                    {/* <Form.Group controlId="ucIsPublished">
                                        <Form.Check
                                            type="checkbox"
                                            label="Is Published"
                                            name="isPublished"
                                            onChange={handleUcFormChange}
                                            defaultChecked={course.isPublished}
                                        />
                                    </Form.Group> */}

                                    <Button variant="primary" type="submit">
                                        Update
                                    </Button>
                                </Form>
                            )
                        }}
                    </Mutation>
                )
            }}
        </Query>
    )
}

EditCourse.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
}

export default EditCourse;
