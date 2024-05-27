import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/login");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>Email Verification</h1>
      <p>Please visit your email and verificate it...</p>
      <Button type="primary" onClick={goToLogin}>
        Go to login page
      </Button>
    </div>
  );
};
