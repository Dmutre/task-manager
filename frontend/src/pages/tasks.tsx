import { useNavigate } from "react-router";

export const Tasks: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <header
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <button onClick={() => navigate("/login")}>Logout</button>
      </header>
      <h1>Tasks</h1>
    </div>
  );
};
