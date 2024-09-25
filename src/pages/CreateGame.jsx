import React from "react";
import { Form, Button, Select, Input } from "antd";
import { useNavigate } from "react-router-dom";

const CreateGame = () => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/game");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="text-white text-center">
      <h1>Crear partida</h1>
      <Form
        name="Crear Partida"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label={<span style={{ color: "white" }}>Nombre de la Partida</span>}
          name="nombre"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(
                    <span style={{ fontSize: 13 }}>
                      ¡Ingresar el nombre es obligatorio!
                    </span>
                  );
                }
                if (!/^[a-zA-Z0-9]+$/.test(value)) {
                  return Promise.reject(
                    <span style={{ fontSize: 13 }}>
                      ¡Solo caracteres alfanuméricos!
                    </span>
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Ingresar nombre de la partida" />
        </Form.Item>

        <Form.Item
          name="jugadores"
          label={
            <span style={{ color: "white" }}>Cantidad máxima de Jugadores</span>
          }
          rules={[
            { required: true, message: "Por favor selecciona una opción" },
          ]}
        >
          <Select placeholder="Selecciona una opción">
            <Option value="2">2 jugadores</Option>
            <Option value="3">3 jugadores</Option>
            <Option value="4">4 jugadores</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="password"
          label={<span style={{ color: "white" }}>Contraseña</span>}
        >
          <Input placeholder="Ingresar contraseña" />
        </Form.Item>

        <Form.Item name="boton">
          <Button type="primary" htmlType="submit">
            Crear
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateGame;
