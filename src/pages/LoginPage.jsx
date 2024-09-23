import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import LobbySquares from "../components/LobbySquares";

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/lobby");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="pt-2">
      <LobbySquares />
      <h1 className="text-white font-sans uppercase m-auto mt-40 text-center  text-4xl">
        El Switcher
      </h1>
      <Form
        className="bg-black p-2 rounded-lg shadow-lg m-auto"
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 350,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label={<span style={{ color: "black" }}>Nombre de Jugador</span>}
          name="username"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(
                    <span style={{ fontSize: 13 }}>
                      El nombre es obligatorio!
                    </span>
                  );
                }
                if (!/^[a-zA-Z0-9]+$/.test(value)) {
                  return Promise.reject(
                    <span style={{ fontSize: 13 }}>
                      Solo caracteres alfanuméricos!
                    </span>
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Ingresar nombre jugador" />
        </Form.Item>

        <Form.Item className="ml-32">
          <Button type="primary" htmlType="submit">
            Jugar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginPage;
