import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Form, Icon, Item, Label, Comment } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import moment from "moment";
import {
  DELET_POST_MUTATION,
  FETCH_POSTS_QUERY,
  LIKE_POST_MUTATION,
} from "../util/queries";
import { AuthContext } from "../context/userContext";
import CustomLoader from "../components/CustomLoader";

const Post = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  let queryParams = Object.fromEntries([...searchParams]);
  const [currentPage] = useState(queryParams?.page ? queryParams?.page : 0);

  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const getPostVariables = {
    postId: params.postId,
  };

  const { data, loading: postLoading } = useQuery(FETCH_SINGLE_POST, {
    variables: getPostVariables,
    skip: !params.postId,
  });

  const { values, onChange, onSubmit } = useForm(createCommentCallback, {
    body: "",
  });

  const [comment, { loading, error }] = useMutation(COMMENT_MUTATION, {
    variables: {
      postId: params.postId,
      ...values,
    },
    update: (proxy, result) => {
      values.body = "";
      console.log(result);
    },
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
      if (error.graphQLErrors[0].message === "Invalid/Expired token") {
        logout();
      }
    },
    refetchQueries: [{ query: FETCH_SINGLE_POST, variables: getPostVariables }],
  });

  const [likePostMutation] = useMutation(LIKE_POST_MUTATION, {
    variables: getPostVariables,
    refetchQueries: [{ query: FETCH_SINGLE_POST, variables: getPostVariables }],
    onError: (error) => {
      if (error.graphQLErrors[0].message === "Invalid/Expired token") {
        logout();
      }
    },
  });

  const [deletePost, { loading: deleteLoading }] = useMutation(
    DELET_POST_MUTATION,

    {
      refetchQueries: [
        {
          query: FETCH_POSTS_QUERY,
          variables: {
            page: +currentPage - 1,
          },
        },
      ],
      onCompleted: () => {
        if (currentPage === 0) {
          navigate("/");
        } else {
          navigate(`/?page=${currentPage}`);
        }
      },
      onError: (error) => {
        console.log(error.graphQLErrors[0].message);
        if (error.graphQLErrors[0].message === "Invalid/Expired token") {
          logout();
        }
      },
    }
  );

  function createCommentCallback() {
    comment();
  }

  if (postLoading) {
    return <CustomLoader />;
  }
  return (
    <div className="singlepost">
      <Item.Group>
        <Item>
          <Item.Image
            size="small"
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
          />
          <Item.Content>
            <Item.Header as="a">{data?.getPost?.username}</Item.Header>
            <Item.Description>{data?.getPost?.body}</Item.Description>
            <Item.Extra>
              {user && (
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={likePostMutation}
                >
                  <Button
                    color="teal"
                    basic={
                      user?.username &&
                      !data?.getPost.likes.find(
                        (like) => like.username === user?.username
                      )
                    }
                  >
                    <Icon name="heart" />
                    Like
                  </Button>
                  <Label basic color="teal" pointing="left">
                    {data?.getPost?.likeCount}
                  </Label>
                </Button>
              )}
              {user?.username === data?.getPost.username && (
                <Button
                  color="red"
                  size="mini"
                  loading={deleteLoading}
                  onClick={() => {
                    deletePost({
                      variables: {
                        postId: data?.getPost._id,
                      },
                      refetchQueries: [
                        {
                          query: FETCH_POSTS_QUERY,
                        },
                      ],
                    });
                  }}
                >
                  <Icon name="trash" />
                </Button>
              )}
            </Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
      {user && (
        <Form onSubmit={onSubmit}>
          <Form.Field>
            <Form.Input
              placeholder="Hi World!"
              name="body"
              onChange={onChange}
              value={values.body}
            />
            <Button type="submit" color="teal" loading={loading}>
              comment
            </Button>
          </Form.Field>
        </Form>
      )}
      <Comment.Group>
        {data?.getPost?.comments.length > 0 ? (
          <h2 style={{ marginTop: 40 }}>Comments:</h2>
        ) : (
          <h2 style={{ marginTop: 40, color: "#333" }}>no comments yet</h2>
        )}

        {data?.getPost?.comments?.map((comment) => (
          <Comment key={comment._id}>
            <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/large/molly.png" />
            <Comment.Content>
              <Comment.Author>{comment.username}</Comment.Author>
              <Comment.Metadata>
                <div>{moment(comment.createdAt).fromNow(true)} </div>
              </Comment.Metadata>
              <Comment.Text>
                <p>{comment.body}</p>
              </Comment.Text>
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>
      {error && (
        <div className="ui error message">{error.graphQLErrors[0].message}</div>
      )}
    </div>
  );
};

const FETCH_SINGLE_POST = gql`
  query GetPost($postId: ID!) {
    getPost(postId: $postId) {
      _id
      body
      username
      comments {
        body
        username
        createdAt
        _id
      }
      likes {
        _id
        username
      }
      likeCount
      commentCount
      createdAt
    }
  }
`;

const COMMENT_MUTATION = gql`
  mutation CreateComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      _id
    }
  }
`;

export default Post;
