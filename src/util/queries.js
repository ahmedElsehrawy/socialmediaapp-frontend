import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
  query GetPosts {
    getPosts {
      _id
      body
      username
      comments {
        _id
        body
        username
        createdAt
      }
      likes {
        username
      }
      likeCount
      commentCount
      user
      createdAt
    }
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      _id
      body
      username
      comments {
        _id
        body
        username
        createdAt
      }
      likes {
        username
      }
      likeCount
      commentCount
      user
      createdAt
    }
  }
`;

export const DELET_POST_MUTATION = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      _id
      body
    }
  }
`;
