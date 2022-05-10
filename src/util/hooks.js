import { useState, useEffect } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};

export const useResize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListner = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListner);
    return () => {
      window.removeEventListener("resize", resizeListner);
    };
  }, []);

  return { width };
};
