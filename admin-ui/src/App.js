import React from "react";
import { Table } from "antd";
import "./App.css";

function App() {
  const [rooms, setRooms] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const d = await fetch(
        "https://example.com/game-service-path/secret-path-that-no-one-knows"
      );
      const data = await d.json();
      console.log(data);
      setRooms(data.rooms);
    };

    const interval = setInterval(() => fetchData(), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  console.log(rooms);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "start",
      dataIndex: "start",
      sorter: (a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      },
    },
    {
      title: "task",
      dataIndex: "task",
      sorter: (a, b) => {
        return new Date(a.task).getTime() - new Date(b.task).getTime();
      },
    },
    {
      title: "hints",
      render: (_: any, record: Item) => {
        if (!record.hints) return <>0</>;
        return <>{record.hints.length}</>;
      },
    },
    {
      title: "completed",
      dataIndex: "end",
      sorter: (a, b) => {
        if (!a.end) a.end = 0;
        if (!b.end) b.end = 0;

        return new Date(a.end).getTime() - new Date(b.end).getTime();
      },
    },
    {
      title: "time",
      render: (_: any, record: Item) => {
        if (!record.end) return <>-</>;
        const time = Math.round(
          (new Date(record.end).getTime() - new Date(record.start).getTime()) /
            1000
        );
        return <>{time}s</>;
      },
      sorter: (a, b) => {
        if (!a.end) a.end = 0;
        if (!b.end) b.end = 0;

        return new Date(a.end).getTime() - new Date(b.end).getTime();
      },
    },
  ];

  return (
    <div className="App">
      <Table
        pagination={false}
        columns={columns}
        dataSource={rooms}
        rowKey="id"
      />
    </div>
  );
}

export default App;
