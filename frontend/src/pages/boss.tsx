import { useNavigate } from "react-router-dom";
import { Role } from "./signUp";
import { Button, Card, Form, Input, Modal } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ROLE_LOCALSTORAGE_KEY,
  SERVER_URL,
  TOKEN_LOCALSTORAGE_KEY,
} from "../constants";

import { LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { Task } from "./tasks";

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
  bossId: string;
};

export type Employee = Omit<User, "role"> & { role: Role.EMPLOYEE };

type SelectedEmployee = Employee & { tasks: Task[] | null };

export type Boss = Omit<User, "role"> & { role: Role.BOSS };

export const Boss: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] =
    useState<SelectedEmployee | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/auth/boos/employee`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            TOKEN_LOCALSTORAGE_KEY
          )}`,
        },
      })
      .then((response) => {
        setEmployees(response.data);
      });
  }, []);

  const EMPLOYEES: Employee[] = [
    {
      id: "1",
      username: "employee1",
      email: "employee1@gmail.com",
      role: Role.EMPLOYEE,
      bossId: "1",
    },
    {
      id: "2",
      username: "employee2",
      email: "employee2@gmail.com",
      role: Role.EMPLOYEE,
      bossId: "1",
    },
    {
      id: "3",
      username: "employee3",
      email: "employee3@gmail.com",
      role: Role.EMPLOYEE,
      bossId: "1",
    },
  ];

  const openAssignTaskModal = (employee: Employee) => {
    axios
      .get(`${SERVER_URL}/tasks/${employee.id}`)
      .then((response) => {
        setSelectedEmployee({ ...employee, tasks: response.data });
      })
      .catch(() => {
        setSelectedEmployee({ ...employee, tasks: null });
      });
  };

  const closeAssignTaskModal = () => {
    setSelectedEmployee(null);
  };

  const openAddEmployeeModal = () => {
    setIsAddingEmployee(true);
  };

  const closeAddEmployeeModal = () => {
    setIsAddingEmployee(false);
  };

  const handleAddEmployee = (employee: Employee) => {
    const newEmployee: Employee = {
      ...employee,
      id: `${employee.username}-${employees.length + 1}`,
      role: Role.EMPLOYEE,
      bossId: "1",
    };
    setEmployees([...employees, newEmployee]);
    closeAddEmployeeModal();
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
    localStorage.removeItem(ROLE_LOCALSTORAGE_KEY);
    navigate("/login");
  };
  return (
    <>
      <div
        style={{
          margin: 10,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 20px)",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Title level={2}>Employees</Title>
          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <Button icon={<PlusOutlined />} onClick={openAddEmployeeModal}>
              Add Employee
            </Button>
            <Button icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Button>
          </div>
        </header>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            height: "100%",
          }}
        >
          {employees.length > 0 ? (
            employees.map((employee) => (
              <Card
                style={{
                  width: 300,
                  height: 200,
                  margin: 10,
                  padding: 10,
                }}
                key={employee.id}
                onClick={() => openAssignTaskModal(employee)}
              >
                <Title level={3}>{employee.username}</Title>
                <p>{employee.email}</p>
              </Card>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Title level={3}>No employees found</Title>
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setEmployees(EMPLOYEES);
                }}
              >
                Use hardcoded employees to test the page
              </Button>
            </div>
          )}
        </div>
      </div>
      <Modal
        okText="Assign Task"
        open={selectedEmployee !== null}
        onCancel={closeAssignTaskModal}
      >
        <div
          style={{
            margin: 10,
          }}
        >
          <Title level={3}>{selectedEmployee?.username}</Title>
          <p>Tasks:</p>
        </div>
      </Modal>
      <Modal
        footer={null}
        open={isAddingEmployee}
        onCancel={closeAddEmployeeModal}
      >
        <div
          style={{
            margin: 10,
          }}
        >
          <Title level={3}>
            This will only hardcode employee, to test UI, you can create it with
            signUp page
          </Title>
          <p>Form to add employee</p>
          <Form onFinish={handleAddEmployee}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item<Employee>
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add hardcoded employee
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
