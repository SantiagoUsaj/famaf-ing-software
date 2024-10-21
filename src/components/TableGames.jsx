import React, { useRef, useState } from "react";
import { Space, Table, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { JoinGame } from "../services/LobbyServices";
import { useNavigate } from "react-router-dom";
import { usePlayerContext } from "../context/PlayerContext.jsx";
import { useGameContext } from "../context/GameContext.jsx";

const { Column } = Table;

const TableGames = ({ gamesList }) => {
  const navigate = useNavigate();
  const { playerID } = usePlayerContext();
  const { setGameID } = useGameContext();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Limpiar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const join = async (game_id) => {
    console.log("Success");

    try {
      const response = await JoinGame(playerID, game_id);

      if (response) {
        console.log("New Game Info:", response);
        setGameID(game_id);
        navigate(`/waitingRoom`);
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  return (
    <>
      <Table
        className="w-1/4 m-auto my-2 rounded-lg"
        dataSource={gamesList}
        pagination={{ pageSize: 5, size: "small" }}
        style={{ backgroundColor: "#FAFAFA", minWidth: "350px", position: "relative" }}
      >
        <Column
          title={<div style={{ textAlign: "center" }}>Nombre Partida</div>}
          dataIndex="game_name"
          key="game_name"
          {...getColumnSearchProps("game_name")}
        />
        <Column
          title={<div style={{ textAlign: "center" }}>Jugadores</div>}
          dataIndex="players"
          key="players"
          {...getColumnSearchProps("players")}
          render={(_, record) =>
            record.state === "playing"
              ? `${record.game_size} / ${record.game_size}`
              : `${record.players} / ${record.game_size}`
          }
        />
        <Column
          title={<div style={{ textAlign: "center" }}>Estado</div>}
          dataIndex="game_id"
          key="game_id"
          align="center"
          render={(_, record) => (
            <Space size="middle">
              {record.state === "waiting" &&
              record.players < record.game_size ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-blancofondo font-bold py-2 px-2 rounded"
                  onClick={() => join(record.game_id)}
                >
                  Unirme
                </button>
              ) : record.state === "playing" ? (
                <span className="text-verdeficha font-bold">Jugando</span>
              ) : (
                <span className="text-rojoficha font-bold">Sala llena</span>
              )}
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default TableGames;