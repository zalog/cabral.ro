import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';
import { store } from "./../store/index";

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
            commentId
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

export function postComment(payload) {
  // renames params keys to match wp-api
  Object.entries({
    'singleId': 'post',
    'commentId': 'parent',
    'name': 'author_name',
    'email': 'author_email',
    'site': 'author_url',
    'message': 'content'
  }).forEach(entry => {
    payload[entry[1]] = payload[entry[0]];
    delete payload[entry[0]];
  });

  return new Promise((resolve, reject) => {
    Vue.prototype.$http({
      method: 'post',
      url: ENDPOINTS.COMMENTS,
      params: payload
    })
    .then((response) => {
      store.commit('ui/addToast', {
        message: 'Mesajul a fost trimis!',
        variant: 'success'
      });
      resolve(response);
    })
    .catch((error) => {
      store.commit('ui/addToast', {
        message: 'Mesajul nu s-a trimis!',
        variant: 'danger'
      });
      reject(error);
    });
  });
}