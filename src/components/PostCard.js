import React, { useContext } from "react";
import { Card, Button, Icon, Label, Image } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../context/userContext";
import {
  DELET_POST_MUTATION,
  FETCH_POSTS_QUERY,
  LIKE_POST_MUTATION,
} from "../util/queries";

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);

  const [likePostMutation] = useMutation(LIKE_POST_MUTATION, {
    variables: {
      postId: post._id,
    },
    update: (cache, { data }) => {
      const { getPosts } = cache.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      let newPost = data.likePost;

      const likedUnlikedPostIndex = getPosts.findIndex(
        (post) => post._id === newPost._id
      );

      let newPosts = getPosts.filter((post) => post._id !== newPost._id);

      newPosts.splice(likedUnlikedPostIndex, 0, data.likePost);

      cache.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: newPosts,
        },
      });
    },
  });

  const [deletePost, { loading }] = useMutation(DELET_POST_MUTATION, {
    variables: {
      postId: post._id,
    },
    update: (cache, { data }) => {
      const { getPosts } = cache.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      cache.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: getPosts.filter((item) => item._id !== post._id),
        },
      });
    },
  });

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{post.username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${post._id}`}>
          {moment.utc(post.createdAt).local().fromNow(true)}
        </Card.Meta>
        <Card.Description>{post.body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="btns-container">
          <Button
            size="mini"
            as="div"
            labelPosition="right"
            onClick={likePostMutation}
          >
            <Button
              color="teal"
              basic={
                (user?.username &&
                  !post.likes.find(
                    (like) => like.username === user?.username
                  )) ||
                false
              }
            >
              <Icon name="heart" />
              Like
            </Button>
            <Label basic color="teal" pointing="left">
              {post.likeCount}
            </Label>
          </Button>
          <Button
            size="mini"
            as={Link}
            to={`/posts/${post._id}`}
            labelPosition="right"
            onClick={() => {}}
          >
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {post.commentCount}
            </Label>
          </Button>
          {user?.username === post.username && (
            <Button
              color="red"
              size="mini"
              loading={loading}
              onClick={deletePost}
            >
              <Icon name="trash" />
            </Button>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default PostCard;
