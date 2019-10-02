import React, { Component } from 'react';
import PropTypes from 'prop-types';

// check this file, u will understand how apollo client Query or Mutation works basically.
class Query extends Component {
    static propTypes = {
        children: PropTypes.func.isRequired,
        query: PropTypes.string.isRequired
    }

    fetchData = () => {
        return {
            loading: false,
            error: null,
            data: {
                courses: [
                    { id: '1', name: 'graphql' },
                    { id: '2', name: 'nodejs' },
                    { id: '3', name: 'mongodb' }
                ]
            }
        }
    };

    render() {
        const { children } = this.props;
        const queryResult = this.fetchData();
        return children(queryResult);
    }
}

const CustomQueryRenderCourses = () => {
    return (
        <Query
            query={`{
                courses: {
                    id,
                    name
                }
            }`}
        >
            {({ data, loading, error }) => {
                if (loading) return <div>loading</div>
                if (error) return <div>error</div>
                return data.courses.map((el, idx) => <p key={idx}>{el.name}</p>)
            }}
        </Query>
    )
}

export default CustomQueryRenderCourses;
