import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';

export function fetchComments(payload) {
  let params = {
    onPage: 10,
    after: null,
    ...payload
  };

  return new Promise((resolve, reject) => {
    Vue.prototype.$http({
      method: 'post',
      url: ENDPOINTS.GRAPHQL,
      data: {
        query: `
          query GET_COMMENTS_FOR_POST(
            $id: ID,
            $first: Int,
            $after: String
          ) {
            comments(
              first: $first,
              after: $after,
              where: {contentId: $id}
            ) {
              nodes {
                ...CommentFields
                replies: children {
                  nodes {
                    ...CommentFields
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }

          fragment CommentFields on Comment {
            author {
              ... on CommentAuthor {
                name
                url
              }
            }
            date
            content
          }
        `,
        variables: {
          "id": params.singleId,
          "first": params.onPage,
          "after": params.after
        }
      }
    })
    .then((response) => resolve(response.data.data.comments))
    .catch((error) => reject(error));
  });
}
