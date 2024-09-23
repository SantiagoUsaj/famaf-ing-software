import React from "react";
import { Form, Button, Select } from "antd";
import { useNavigate } from "react-router-dom";

const onFinish = (values) => {
  console.log("Success:", values);
  navigate("/game");
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

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
          name="nombre"
          /*rules={[
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
          ]}*/
        >
          <label style={{ color: "white" }}>Nombre de la Partida</label>
          <input type="text" name="gameName" />
        </Form.Item>

        <Form.Item
          name="jugadores"
          label={<span style={{ color: "white" }}>Cantidad de Jugadores</span>}
          rules={[
            { required: true, message: "Por favor selecciona una opción" },
          ]}
        >
          <Select placeholder="Selecciona una opción">
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
          </Select>
        </Form.Item>

        <Form.Item name="password">
          <label style={{ color: "white" }}>Contraseña</label>
          <input type="text" name="password" />
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
