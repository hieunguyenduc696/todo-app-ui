import { useEffect, useState } from "react";
import { Button, Input, List, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const SERVER_URL = "https://todo-app-be-0727221afcfc.herokuapp.com";

interface Todo {
  _id: string;
  content: string;
}

function App() {
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [isFetched, setIsFetched] = useState(false);

  const addTodo = async () => {
    const content = newTodo.trim();
    if (content === "") {
      message.error("Todo content must not be empty");
      return;
    }

    const response = await fetch(`${SERVER_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const { statusCode, todo } = await response.json();

    if (statusCode === 201) {
      setTodoItems([...todoItems, todo]);
      setNewTodo("");
      message.success(`Create todo successfully!`);
    } else {
      message.error("Fail to create todo");
    }
  };

  const deleteTodo = async (id: string) => {
    const response = await fetch(`${SERVER_URL}/todo/${id}`, {
      method: "DELETE",
    });

    const { statusCode } = await response.json();

    if (statusCode === 200) {
      const updatedTodos = todoItems.filter((todo) => todo._id !== id);
      setTodoItems(updatedTodos);
      message.success(`Delete todo successfully!`);
    } else {
      message.error("Fail to delete todo");
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(`${SERVER_URL}/todo`);
      const { todos, statusCode } = await response.json();

      if (statusCode !== 200) {
        message.error("Can not fetch todos");
      } else {
        setTodoItems(todos);
        setIsFetched(true);
      }
    };
    if (!isFetched) {
      fetchTodos();
    }
  }, [isFetched]);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        maxWidth: 500,
        margin: "auto",
        marginTop: "3rem",
      }}
    >
      <Space.Compact
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Input
          style={{ width: "calc(100% - 200px)" }}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo item"
          onPressEnter={addTodo}
        />
        <Button type="primary" onClick={addTodo}>
          Create
        </Button>
      </Space.Compact>
      <List
        style={{ marginTop: "20px" }}
        bordered
        dataSource={todoItems}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteTodo(item._id)}
              />,
            ]}
          >
            {item.content}
          </List.Item>
        )}
      />
    </div>
  );
}

export default App;
