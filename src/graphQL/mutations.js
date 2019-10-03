import gql from 'graphql-tag';

export const SIGNUP_USER = gql`
    mutation SignupUser($data: UserBasicInput!) {
        signupUser(data: $data) {
            token
            user {
                id
                email
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation LoginUser($data: UserBasicInput!) {
        loginUser(data: $data) {
            token
            user {
                id
                email
            }
        }
    }
`;

export const CREATE_COURSE = gql`
    mutation CreateCourse($data: CourseCreateInput!) {
        createCourse(data: $data) {
            id
            name
            description,
            isPublished
        }
    }
`;

export const UPDATE_COURSE = gql`
    mutation UpdateCourse($data: CourseUpdateInput!, $where: CourseWhereUniqueInput!) {
        updateCourse(data: $data, where: $where) {
            id
            name
            description
            isPublished
        }
    }
`;

export const DELETE_COURSE = gql`
    mutation DeleteCourse($where: CourseWhereUniqueInput!) {
        deleteCourse(where: $where) {
            id
            name
            description
            isPublished
        }
    }
`;
