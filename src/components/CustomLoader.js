import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const CustomLoader = () => {
  return (
    <Dimmer style={{ marginTop: 60 }} active inverted>
      <Loader size="massive" />
    </Dimmer>
  );
};

export default CustomLoader;
