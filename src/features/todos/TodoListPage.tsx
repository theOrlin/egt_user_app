import { useEffect, useState } from 'react';
import { fetchTodos, type Todo } from '../../api/todoApi';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchUsers } from '../users/userSlice';
import styles from './TodoListPage.module.css';

interface TodoWithUsername extends Todo {
  userName: string;
}

const TODOS_PER_PAGE = 10;

export default function TodoListPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.list);
  const [todos, setTodos] = useState<TodoWithUsername[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  type statusFilterValue = 'all' | 'completed' | 'incomplete';

  const [statusFilter, setStatusFilter] = useState<statusFilterValue>('all');
  const [titleFilter, setTitleFilter] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | number>('all');

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, []);

  useEffect(() => {
    fetchTodos()
      .then((todosData) => {
        if (users.length > 0) {
          const userMap = Object.fromEntries(
            users.map((user) => [user.id, user.name])
          );

          const todosWithUsername = todosData.map((todo) => ({
            ...todo,
            userName: userMap[todo.userId] || 'Unknown User',
          }));

          setTodos(todosWithUsername);
        } else {
          return;
        }
      })
      .finally(() => setLoading(false));
  }, [users]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, titleFilter, userFilter]);

  const filteredTodos = todos.filter((todo) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && todo.completed) ||
      (statusFilter === 'incomplete' && !todo.completed);

    const matchesTitle = todo.title
      .toLowerCase()
      .includes(titleFilter.toLowerCase());

    const matchesUser = userFilter === 'all' || todo.userId === userFilter;

    return matchesStatus && matchesTitle && matchesUser;
  });

  const totalPages = Math.ceil(filteredTodos.length / TODOS_PER_PAGE);
  const startIndex = (currentPage - 1) * TODOS_PER_PAGE;
  const currentTodos = filteredTodos.slice(
    startIndex,
    startIndex + TODOS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setCurrentPage(newPage);
  };

  if (loading) {
    return <p>Loading todos...</p>;
  }

  const togleTodoStatus = (todoId: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const userOptionsMap = new Map<number, string>();
  todos.forEach((todo) => {
    if (!userOptionsMap.has(todo.userId)) {
      userOptionsMap.set(todo.userId, todo.userName);
    }
  });

  return (
    <div>
      <h2>Todo List</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Status:
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as statusFilterValue)
              }>
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Not Completed</option>
            </select>
          </label>

          <label style={{ marginLeft: '1rem' }}>
            Title:
            <input
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Search by title..."
            />
          </label>

          <label style={{ marginLeft: '1rem' }}>
            User:
            <select
              value={userFilter}
              onChange={(e) => {
                const value = e.target.value;
                setUserFilter(value === 'all' ? 'all' : Number(value));
              }}>
              <option value="all">All Users</option>
              {[...new Set(todos.map((todo) => todo.userId))].map((userId) => (
                <option key={userId} value={userId}>
                  {userOptionsMap.get(userId)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Title</th>
              <th>Complete?</th>
            </tr>
          </thead>
          <tbody>
            {currentTodos.map((todo) => (
              <tr key={todo.id}>
                <td className={styles.owner}>{todo.userName}</td>
                <td className={styles.title}>{todo.title}</td>
                <td className={styles.status}>
                  <Button
                    onClick={() => togleTodoStatus(todo.id)}
                    icon={
                      todo.completed ? <CheckOutlined /> : <CloseOutlined />
                    }
                    color={todo.completed ? 'green' : 'orange'}
                    variant="solid"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          Previous page
        </Button>
        <span style={{ margin: '0 1rem' }}>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          Next page
        </Button>
      </div>
    </div>
  );
}
