import { useNavigate } from "react-router-dom";
import { Role } from "./login";
import { Card, Modal } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";

export type User = {
  id: number;
  username: string;
  email: string;
  role: Role;
  bossId: string;
};

export type Employee = Omit<User, "role"> & { role: Role.EMPLOYEE };

export type Boss = Omit<User, "role"> & { role: Role.BOSS };

export const Boss: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const EMPLOYEES: Employee[] = [
    {
      id: 1,
      username: "employee1",
      email: "employee1@gmail.com",
      role: Role.EMPLOYEE,
      bossId: "1",
    },
    {
      id: 2,
      username: "employee2",
      email: "employee2@gmail.com",
      role: Role.EMPLOYEE,
      bossId: "1",
    },
    {
      id: 3,
      username: "employee3",
      email: "employee3@gmail.com",
      role: Role.EMPLOYEE,
      bossId: "1",
    },
  ];

  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };
  return (
    <>
      <div
        style={{
          margin: 10,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          height: "100vh",
        }}
      >
        {EMPLOYEES.map((employee) => (
          <Card
            style={{
              width: 300,
              height: 200,
              margin: 10,
              padding: 10,
            }}
            key={employee.id}
            onClick={() => openModal(employee)}
          >
            <Title level={3}>{employee.username}</Title>
            <p>{employee.email}</p>
          </Card>
        ))}
      </div>
      <Modal
        okText="Assign Task"
        open={selectedEmployee !== null}
        onCancel={closeModal}
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
    </>
  );
};
