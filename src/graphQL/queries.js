import gql from 'graphql-tag';
import { courseFrag } from './fragments';

export const GET_COURSES_WITH_PAGINATION_AND_FILTER = gql`
    query CoursesWithPagiAndFilter($first: Int, $skip: Int, $orderBy: CourseOrderByInput) {
        courses(first: $first, skip: $skip, orderBy: $orderBy) {
            count
            courses {
                ...ExceptCreatedAt
                createdAt
            }
        }
    }
    ${courseFrag.courseExceptCreatedAt}
`;

export const GET_COURSE_VIA_ID = gql`
    query GetCourseViaId($where: CourseWhereUniqueInput!) {
        course(where: $where) {
            ...ExceptCreatedAt
        }
    }
    ${courseFrag.courseExceptCreatedAt}
`;

export const SEARCH_COURSES = gql`
    query SearchCourse($filter: String) {
        courses(filter: $filter) {
            count
            courses {
                ...ExceptCreatedAt
            }
        }
    }
    ${courseFrag.courseExceptCreatedAt}
`;
