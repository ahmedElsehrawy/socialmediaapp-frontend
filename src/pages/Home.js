import React from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/queries";
import { useResize } from "../util/hooks";

const Home = () => {
  const { data, loading } = useQuery(FETCH_POSTS_QUERY);

  const { width } = useResize();

  if (!data || loading) {
    return <h1>loading</h1>;
  }

  console.table(data?.getPosts);

  return (
    <Grid columns={width < 500 ? 1 : width < 1000 ? 2 : 3}>
      <Grid.Row className="home-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column style={{ marginBottom: 20 }}>
          <PostForm />
        </Grid.Column>
        <Transition.Group>
          {data?.getPosts?.map((post) => (
            <Grid.Column key={post._id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))}
        </Transition.Group>
      </Grid.Row>
    </Grid>
  );
};

export default Home;
