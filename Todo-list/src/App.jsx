import { useState, useEffect } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("todos"));
    if (stored) setTodos(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: input,
        status: "Todo",
        dueDate: new Date().toLocaleDateString(),
      },
    ]);

    setInput("");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateStatus = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          if (todo.status === "Todo") {
            return { ...todo, status: "In Progress" };
          }

          if (todo.status === "In Progress") {
            return { ...todo, status: "Completed" };
          }

          return { ...todo, status: "Todo" };
        }

        return todo;
      })
    );
  };

  const badgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "All") return true;
    return todo.status === filter;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}

      <aside className="w-full md:w-64 bg-[#0f1f4a] text-white">
        <div className="p-6 border-b border-blue-900">
          <h1 className="text-2xl font-bold text-center md:text-left">
            TaskFlow
          </h1>
        </div>

        <nav className="p-3">
          <ul className="flex md:flex-col gap-3 md:gap-2 overflow-x-auto">
            <li
              onClick={() => setFilter("All")}
              className={`px-4 py-3 rounded-lg cursor-pointer whitespace-nowrap transition ${
                filter === "All"
                  ? "bg-blue-600"
                  : "hover:bg-blue-800"
              }`}
            >
              All ({todos.length})
            </li>

            <li
              onClick={() => setFilter("Todo")}
              className={`px-4 py-3 rounded-lg cursor-pointer whitespace-nowrap transition ${
                filter === "Todo"
                  ? "bg-blue-600"
                  : "hover:bg-blue-800"
              }`}
            >
              Todo ({todos.filter((t) => t.status === "Todo").length})
            </li>

            <li
              onClick={() => setFilter("In Progress")}
              className={`px-4 py-3 rounded-lg cursor-pointer whitespace-nowrap transition ${
                filter === "In Progress"
                  ? "bg-blue-600"
                  : "hover:bg-blue-800"
              }`}
            >
              In Progress (
              {todos.filter((t) => t.status === "In Progress").length})
            </li>

            <li
              onClick={() => setFilter("Completed")}
              className={`px-4 py-3 rounded-lg cursor-pointer whitespace-nowrap transition ${
                filter === "Completed"
                  ? "bg-blue-600"
                  : "hover:bg-blue-800"
              }`}
            >
              Completed (
              {todos.filter((t) => t.status === "Completed").length})
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}

      <main className="flex-1 p-4 md:p-8">
        {/* Header */}

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            {filter === "All" ? "All Tasks" : filter}
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Add a task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full sm:w-72 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={addTodo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg cursor-pointer"
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* Mobile Cards */}

        <div className="md:hidden space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center shadow">
              No tasks available
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-xl p-4 shadow"
              >
                <h3 className="font-semibold text-lg">{todo.text}</h3>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor(
                      todo.status
                    )}`}
                  >
                    {todo.status}
                  </span>

                  <span className="text-gray-500 text-sm">
                    {todo.dueDate}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateStatus(todo.id)}
                    className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}

        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-[700px] w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="p-4">Task</th>
                <th className="p-4">Status</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTodos.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-gray-500"
                  >
                    No tasks available
                  </td>
                </tr>
              ) : (
                filteredTodos.map((todo) => (
                  <tr
                    key={todo.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{todo.text}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor(
                          todo.status
                        )}`}
                      >
                        {todo.status}
                      </span>
                    </td>

                    <td className="p-4">{todo.dueDate}</td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => updateStatus(todo.id)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Total Tasks</h3>
            <p className="text-3xl font-bold">{todos.length}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {todos.filter((t) => t.status === "In Progress").length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Completed</h3>
            <p className="text-3xl font-bold text-green-500">
              {todos.filter((t) => t.status === "Completed").length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}