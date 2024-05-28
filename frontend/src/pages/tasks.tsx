import { Button, Card, DatePicker, Form, Input, Modal, Select } from "antd";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ROLE_LOCALSTORAGE_KEY,
  SERVER_URL,
  TOKEN_LOCALSTORAGE_KEY,
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
  userId: number;
};

export const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const openModal = () => {
    setIsAddingTask(true);
  };

  const closeModal = () => {
    setIsAddingTask(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
    localStorage.removeItem(ROLE_LOCALSTORAGE_KEY);
    navigate("/login");
  };

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/task`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error during fetching tasks:", error);
      });
  }, []);

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
        <div>
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
      <Modal open={isAddingTask} onCancel={closeModal}>
        <Form>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
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
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true }]}
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
