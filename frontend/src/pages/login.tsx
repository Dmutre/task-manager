import { useNavigate } from "react-router";
import axios from "axios";
import { SERVER_URL } from "../constants";
import { response } from "express";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    console.log({ username, email, password, role });
    axios
      .post(`${SERVER_URL}/auth/signup`, {
        username,
        email,
        password,
        role,
      })
      .then((response) => {
        console.log(response);
      });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Email:
          <input type="text" name="email" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <fieldset>
          <legend>Role:</legend>
          <input type="radio" name="role" value="boss" />
          <label>Boss</label>
          <input type="radio" name="role" value="user" />
          <label>User</label>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
