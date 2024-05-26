import { Button, Card } from "antd";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

export enum TaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  BLOCKED = "BLOCKED",
}

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  userId: number;
};

export const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const TASKS: Task[] = [
    {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      status: TaskStatus.IN_PROGRESS,
      startDate: new Date(),
      endDate: new Date(),
      userId: 1,
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      status: TaskStatus.CLOSED,
      startDate: new Date(),
      endDate: new Date(),
      userId: 1,
    },
    {
      id: 3,
      title: "Task 3",
      description: "Description 3",
      status: TaskStatus.OPEN,
      startDate: new Date(),
      endDate: new Date(),
      userId: 1,
    },
  ];
  return (
    <div style={{ margin: 20 }}>
      <header
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h1>Tasks</h1>
        <Button onClick={() => navigate("/login")}>Logout</Button>
      </header>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {TASKS.map((task) => (
          <Card
            style={{
              width: 300,
            }}
            key={task.id}
          >
            <Title level={3}>{task.title}</Title>
            <p>{task.description}</p>
            <p>{task.status}</p>
            <p>
              start date:{" "}
              {dayjs(task.startDate).format("YYYY-MM-DD").toString()}
            </p>
            <p>
              end date: {dayjs(task.endDate).format("YYYY-MM-DD").toString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
