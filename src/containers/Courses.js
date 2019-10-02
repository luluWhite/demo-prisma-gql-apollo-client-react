import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';

import { GET_COURSES_WITH_PAGINATION_AND_FILTER } from '../graphQL/queries';
import { DELETE_COURSE } from '../graphQL/mutations';
import { OptNames } from '../constants/gqlOptNames';
import { CommonArgs, variables } from '../constants/commonArgs';
import { storageStr } from '../constants/storageConst';
import Spinner from '../shared/Spinner';
import ErrMsg from '../shared/ErrorMessage';

const initPage = 1;

const Courses = (props) => {
    const [thePage, setThePage] = useState(initPage);

    const setPaginationOrder = () => {
        return {
            first: CommonArgs.COURSES_PER_PAGE,
            skip: (thePage - 1) * CommonArgs.COURSES_PER_PAGE,
            orderBy: 'createdAt_DESC' // check this in schema.graphql
        }
    }

    const prevPage = () => {
        if (thePage > 1) {
            setThePage(thePage - 1)
        }
    }

    const nxPage = (dataCourses) => {
        if (thePage <= dataCourses.count / CommonArgs.COURSES_PER_PAGE) {
            setThePage(thePage + 1)
        }
    }

    return (
        <div>
            <Query
                query={GET_COURSES_WITH_PAGINATION_AND_FILTER}
                variables={setPaginationOrder()}
            >
                {({ data, loading, error }) => {
                    if (loading) return <Spinner />
                    if (error) return <ErrMsg error={error} />

                    const updateAfterDelete = (cache, { data: { deleteCourse } }) => {
                        const { courses } = cache.readQuery({
                            query: GET_COURSES_WITH_PAGINATION_AND_FILTER,
                            variables: setPaginationOrder()
                        });
                        console.log('57 -- courses: ', courses)
                        console.log('58 -- deleteCourse: ', deleteCourse)
                        const theIdx = courses[OptNames.courses].findIndex(el => el.id === deleteCourse.id);
                        const coursesAfterDeleted = courses[OptNames.courses].splice(theIdx, 1)
                        cache.writeQuery({
                            query: GET_COURSES_WITH_PAGINATION_AND_FILTER,
                            data: {
                                courses: {
                                    ...courses,
                                    // courses: courses[OptNames.courses].filter((el, idx) => el.id !== deleteCourse.id),
                                    courses: coursesAfterDeleted
                                }
                            }
                        })
                    }

                    // return 2 things: courses and count
                    return (
                        <>
                            {data[OptNames.courses][OptNames.courses].map((el, idx) => {
                                return (
                                    <Card key={`${idx}_${el.name}`}>
                                        <Card.Title>
                                            {el.name}
                                        </Card.Title>
                                        <Card.Body>
                                            Description: <Card.Text>{el.description}</Card.Text>
                                            {
                                                localStorage.getItem(storageStr.utk) ? (
                                                    <>
                                                        <Link
                                                            to={`/course/${el.id}/edit`}
                                                            className="btn btn-primary"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <Mutation
                                                            mutation={DELETE_COURSE}
                                                            variables={{
                                                                where: { id: el.id }
                                                            }}
                                                            update={updateAfterDelete}
                                                        >
                                                            {(deleteCourse, { data, loading, error }) => {
                                                                if (loading) return <Spinner />
                                                                if (error) return <ErrMsg error={error} />
                                                                return (
                                                                    <Button
                                                                        className="ml-1"
                                                                        variant="danger"
                                                                        onClick={async (event) => {
                                                                            await deleteCourse()
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                )
                                                            }}
                                                        </Mutation>
                                                    </>
                                                ) : null
                                            }
                                        </Card.Body>
                                    </Card>
                                )
                            })}
                            <Pagination size={'lg'} className="justify-content-center">
                                <Pagination.Prev
                                    onClick={prevPage}
                                />
                                <Pagination.Next
                                    onClick={() => {
                                        nxPage(data[OptNames.courses])
                                    }}
                                />
                            </Pagination>
                        </>
                    )
                }}
            </Query>
        </div>
    )
}

Courses.propTypes = {}

export default Courses;
