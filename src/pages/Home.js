import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition, Pagination } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/queries";
import { useResize } from "../util/hooks";
import CustomLoader from "../components/CustomLoader";
import { useNavigate, useSearchParams } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  let params = Object.fromEntries([...searchParams]);
  const [currentPage, setCurrentPage] = useState(
    params?.page ? params.page - 1 : 0
  );
  const { data, loading } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      page: currentPage,
    },
  });

  console.log(
    "🚀 ~ file: Home.js ~ line 22 ~ Home ~ searchParams",
    Object.fromEntries([...searchParams])
  );

  const { width } = useResize();

  const handlePaginationChange = (e, { activePage }) => {
    setCurrentPage(activePage - 1);
    navigate(`/?page=${activePage}`);
  };

  if (!data || loading) {
    return <CustomLoader />;
  }

  console.table(data?.getPosts?.nodes);
  console.log(data?.getPosts?.count);
  console.log(Math.floor(data?.getPosts?.count / 10));

  return (
    <div>
      <Grid columns={width < 500 ? 1 : width < 1000 ? 2 : 3}>
        <Grid.Row className="home-title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column style={{ marginBottom: 20 }}>
            <PostForm currentPage={currentPage} />
          </Grid.Column>
          <Transition.Group>
            {data?.getPosts?.nodes?.map((post) => (
              <Grid.Column key={post._id} style={{ marginBottom: 20 }}>
                <PostCard currentPage={currentPage} post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        </Grid.Row>
      </Grid>
      <div style={{ textAlign: "center" }}>
        <Pagination
          boundaryRange={0}
          defaultActivePage={currentPage + 1}
          ellipsisItem={null}
          onPageChange={handlePaginationChange}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={Math.ceil(data?.getPosts?.count / 10)}
        />
      </div>
    </div>
  );
};

export default Home;
