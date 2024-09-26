import React from "react";
import { Form, Button, Select, Input } from "antd";
import { useNavigate } from "react-router-dom";

const CreateGame = ({ playerID }) => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);
    navigate(`/${playerID}/:gameID/waitingRoom`);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="text-white text-center">
      <h1>Crear partida</h1>
      <Form
        className="bg-black p-2 rounded-lg shadow-lg m-auto"
        name="Crear Partida"
        labelCol={{
          span: 52,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 400,
        }}
        initialValues={{
          remember: true,
        }}
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
                if (value.length > 20) {
                  return Promise.reject(
                    <span style={{ fontSize: 13 }}>
                      ¡El nombre no puede tener más de 20 caracteres!
                    </span>
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
          name="jugadores"
          label={
            <span style={{ color: "white" }}>Cantidad máxima de Jugadores</span>
          }
          rules={[
            { required: true, message: "Por favor selecciona una opción" },
          ]}
        >
          <Select placeholder="Selecciona una opción">
            <Select.Option value="2">2 jugadores</Select.Option>
            <Select.Option value="3">3 jugadores</Select.Option>
            <Select.Option value="4">4 jugadores</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="boton" wrapperCol={{ span: 24, offset: 0 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" htmlType="submit">
              Crear
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateGame;
