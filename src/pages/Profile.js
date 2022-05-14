import React from "react";
import { ME } from "../util/queries";
import { useQuery } from "@apollo/client";
import { Card, Icon, Image } from "semantic-ui-react";
import CustomLoader from "../components/CustomLoader";
import moment from "moment";

const Profile = () => {
  const { data, loading } = useQuery(ME);

  if (!data || loading) {
    return <CustomLoader />;
  }

  return (
    <div
      style={{ textAlign: "center", display: "flex", justifyContent: "center" }}
    >
      <Card>
        <Image
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
          wrapped
          ui={false}
        />
        <Card.Content>
          <Card.Header>{data?.me?.username}</Card.Header>
          <Card.Meta>
            <span className="date">
              joined in {moment(data?.me?.createdAt).year()}
            </span>
          </Card.Meta>
          <Card.Description>{data?.me?.email}</Card.Description>
        </Card.Content>
        {/* <Card.Content extra>
          <a>
            <Icon name="user" />
            22 Friends
          </a>
        </Card.Content> */}
      </Card>
    </div>
  );
};

export default Profile;
