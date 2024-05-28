import { useNavigate } from "react-router";
import axios from "axios";
import { SERVER_URL, TOKEN_LOCALSTORAGE_KEY } from "../constants";
import { Form, Input, Button } from "antd";
import { Role } from "./signUp";

type LoginValues = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = (values: LoginValues) => {
    const { email, password } = values;
    axios
      .post(`${SERVER_URL}/auth/login`, {
        email,
        password,
      })
      .then((response) => {
        const accessToken = response.data.access_token;
        localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, accessToken);
        axios
          .get(`${SERVER_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            const role = response.data.role;
            localStorage.setItem("role", role);
            if (role === Role.BOSS) {
              console.log("boss");
              navigate("/boss");
            } else if (role === Role.EMPLOYEE) {
              navigate("/tasks");
            } else {
              console.error("role not found");
            }
          });
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
      <Form onFinish={onFinish}>
        <Form.Item<LoginValues>
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<LoginValues>
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
          <Button type="link" onClick={() => navigate("/signUp")}>
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
};
