import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      _id
      email
      username
      createdAt
    }
  }
`;

export const FETCH_POSTS_QUERY = gql`
  query GetPosts($page: Int!) {
    getPosts(page: $page) {
      count
      nodes {
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
