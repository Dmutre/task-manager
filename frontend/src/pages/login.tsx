import { useNavigate } from "react-router";
import axios from "axios";
import { SERVER_URL } from "../constants";
import { Form, Input, Radio, Button } from "antd";

export enum Role {
  BOSS = "BOSS",
  EMPLOYEE = "EMPLOYEE",
}

type LoginValues = {
  username: string;
  email: string;
  password: string;
  role: Role;
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = (values: LoginValues) => {
    const { username, email, password, role } = values;
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
        navigate("/");
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
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
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
        <Form.Item<LoginValues> name="role" label="Role">
          <Radio.Group>
            <Radio value={Role.BOSS}>Boss</Radio>
            <Radio value={Role.EMPLOYEE}>User</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
