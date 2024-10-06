import React from "react";
import { Form, Button, Select, Input } from "antd";
import { useNavigate } from "react-router-dom";
import LobbySquares from "../components/LobbySquares";
import { CreateAGame } from "../services/CreateGameServices";
import { usePlayerContext } from "../context/PlayerContext.jsx";
import { useGameContext } from "../context/GameContext.jsx";

const CreateGame = () => {
  const navigate = useNavigate();
  // Obtener playerID desde el contexto
  const { playerID } = usePlayerContext();
  // Obtener game_id desde el contexto
  const { setGameID } = useGameContext();

  const onFinish = async (values) => {
    console.log("Success:", values);

    try {
      // Esperamos la resolución de la promesa de JoinLobby
      const response = await CreateAGame(
        playerID,
        values.nombre,
        values.jugadores
      );

      if (response) {
        console.log("Lobby response:", response);

        // Actualizar el gameID en el contexto
        setGameID(response.game_id);

        navigate(`/waitingRoom`);
      }
    } catch (error) {
      console.error("Error joining lobby:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="pt-2">
      <LobbySquares />
      <h1 className="text-white font-sans uppercase m-auto mt-40 text-center  text-4xl">
        Crear partida
      </h1>
      <Form
        className="bg-black p-2 rounded-lg shadow-lg m-auto"
        name="Crear Partida"
        labelCol={{
          span: 4,
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
          label={<span style={{ color: "black" }}>Nombre de la Partida</span>}
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
                      ¡No más de 20 caracteres!
                    </span>
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Ingresar nombre partida" />
        </Form.Item>

        <Form.Item
          name="jugadores"
          label={
            <span style={{ color: "black" }}>Cantidad máxima de Jugadores</span>
          }
          rules={[
            { required: true, message: "Por favor selecciona una opción" },
          ]}
        >
          <Select placeholder="Selecciona cantidad jugadores">
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
