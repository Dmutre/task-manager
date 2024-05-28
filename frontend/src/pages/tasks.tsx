import {
  Button,
  Card,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Modal,
  Select,
} from "antd";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { LegacyRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ROLE_LOCALSTORAGE_KEY,
  SERVER_URL,
  TOKEN_LOCALSTORAGE_KEY,
  USER_ID_LOCALSTORAGE_KEY,
} from "../constants";

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
  userId: string;
};

export const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const formRef = useRef<FormInstance<Task>>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setIsAddingTask(true);
  };

  const closeModal = () => {
    setIsAddingTask(false);
  };

  const handleCreateTask = async (values: Task) => {
    const userID = localStorage.getItem(USER_ID_LOCALSTORAGE_KEY);
    const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);

    if (!userID || !token) {
      navigate("/login");
      return;
    }

    const startDate = dayjs(values.startDate).toISOString();
    const endDate = dayjs(values.endDate).toISOString();

    console.log("Start Date:", startDate, "Type:", typeof startDate);
    console.log("End Date:", endDate, "Type:", typeof endDate);

    const newTaskValues = {
      ...values,
      startDate: startDate,
      endDate: endDate,
      userId: userID,
    };

    try {
      const response = await axios.post(`${SERVER_URL}/task`, newTaskValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks([...tasks, response.data]);
      closeModal();
    } catch (error) {
      console.error("Error during task creation:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
    localStorage.removeItem(ROLE_LOCALSTORAGE_KEY);
    localStorage.removeItem(USER_ID_LOCALSTORAGE_KEY);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/task`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error during fetching tasks:", error);
        setError("Failed to fetch tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Button onClick={openModal}>Add Task</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {tasks.map((task) => (
          <Card
            style={{
              width: 300,
            }}
            key={task.id}
          >
            <Title level={3}>{task.title}</Title>
            <p>{task.description}</p>
            <p>{task.status}</p>
            <p>Start date: {dayjs(task.startDate).format("YYYY-MM-DD")}</p>
            <p>End date: {dayjs(task.endDate).format("YYYY-MM-DD")}</p>
          </Card>
        ))}
      </div>
      <Modal open={isAddingTask} onCancel={closeModal}>
        <Form<Task>
          ref={formRef as LegacyRef<FormInstance<Task>>}
          onFinish={handleCreateTask}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select>
              <Select.Option value={TaskStatus.IN_PROGRESS}>
                In Progress
              </Select.Option>
              <Select.Option value={TaskStatus.OPEN}>Open</Select.Option>
              <Select.Option value={TaskStatus.CLOSED}>Closed</Select.Option>
              <Select.Option value={TaskStatus.BLOCKED}>Blocked</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[
              { required: true, message: "Please select the start date!" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true, message: "Please select the end date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
