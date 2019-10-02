import gql from 'graphql-tag';

export const courseFrag = {
    courseExceptCreatedAt: gql`
        fragment ExceptCreatedAt on Course {
            id
            description
            name
            isPublished
        }
    `
}
