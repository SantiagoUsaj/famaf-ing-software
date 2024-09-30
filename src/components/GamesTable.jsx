import React from "react";
import { Table } from "antd";

const columns = [
    {
      title: 'Names',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Players',
      key: 'players',
      align: 'center',
      render: (_, record) => `${record.players.length} / ${record.size}`
    },
    {
      dataIndex: 'Join',
      align: 'center',
    },
  ];

const GamesTable = ({gamesList}) => ( 
    
    <Table 
        columns={columns} 
        dataSource={gamesList.filter(game => game.state === 'waiting' && game.players.length < game.size)}
        size = "large" 
        title={() => <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Games Available</div>}
    />

   );

export default GamesTable;
