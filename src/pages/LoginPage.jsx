import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/waitingRoom");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="pt-2">
      <Form
        className="bg-white p-2 rounded-lg shadow-lg m-auto my-52"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 500,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Nombre de Jugador"
          name="username"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(
                    new Error("El nombre de jugador es obligatorio!")
                  );
                }
                if (!/^[a-zA-Z0-9]+$/.test(value)) {
                  return Promise.reject(
                    new Error("Solo se permiten caracteres alfanuméricos!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Jugar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginPage;
