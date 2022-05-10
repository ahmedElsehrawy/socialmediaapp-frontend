import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Form, Button } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/queries";

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { loading, error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update: (proxy, result) => {
      values.body = "";
    },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
  });

  function createPostCallback() {
    console.log(values);
    createPost();
  }

  return (
    <React.Fragment>
      <Form onSubmit={onSubmit}>
        <h2>Create Post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
          />
          <Button type="submit" color="teal" loading={loading}>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message">{error.graphQLErrors[0].message}</div>
      )}
    </React.Fragment>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($body: String) {
    createPost(body: $body) {
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

export default PostForm;
