import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../constants";
import { Spin } from "antd";

export const SendVerifyCode: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  console.log(token);

  axios
    .post(`${SERVER_URL}/auth/email/verify`, { token: token })
    .then((response) => {
      navigate("/login");
    });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin size="large" />
      <h1>Verificating your email, wait a second...</h1>
    </div>
  );
};
