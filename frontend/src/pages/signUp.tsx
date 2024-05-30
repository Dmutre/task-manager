import { useNavigate } from "react-router";
import axios from "axios";
import { SERVER_URL } from "../constants";
import { Form, Input, Radio, Button } from "antd";

export enum Role {
  BOSS = "BOSS",
  EMPLOYEE = "EMPLOYEE",
}

type SignUpValues = {
  username: string;
  email: string;
  password: string;
  role: Role;
};

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = (values: SignUpValues) => {
    const { username, email, password, role } = values;
    axios
      .post(`${SERVER_URL}/auth/signup`, {
        username,
        email,
        password,
        role,
      })
      .then((response) => {
        axios
          .post(`${SERVER_URL}/auth/email/request-verification`, { email })
          .then((response) => {
            navigate("/verification");
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
        <Form.Item<SignUpValues>
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<SignUpValues>
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<SignUpValues>
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<SignUpValues> name="role" label="Role">
          <Radio.Group>
            <Radio value={Role.BOSS}>Boss</Radio>
            <Radio value={Role.EMPLOYEE}>User</Radio>
          </Radio.Group>
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
              Sign Up
            </Button>
          </Form.Item>
          <Button type="link" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
};
