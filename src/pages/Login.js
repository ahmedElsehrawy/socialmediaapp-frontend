import React, { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/userContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [logUserIn, { loading }] = useMutation(LOG_USER_MUTATION, {
    variables: values,
    update: (_, data) => {
      const user = {
        username: data.data.login.username,
        id: data.data.login._id,
      };
      login(data.data.login.token, data.data.login._id, user);

      navigate("/");
    },
    onError: (errors) => {
      setErrors(errors.graphQLErrors[0].extensions.errors);
    },
  });

  function loginUserCallback() {
    logUserIn();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate>
        <h1>Login</h1>
        <Form.Input
          label="username"
          placeholder="username.."
          name="username"
          type="text"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />
        <Form.Input
          label="password"
          placeholder="password.."
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />
        <Button type="submit" primary loading={loading}>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOG_USER_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      _id
      token
      username
    }
  }
`;

export default Login;
