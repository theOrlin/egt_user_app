import { Route, Routes } from 'react-router';
import Users from './features/users/Users';
import UserPostsPage from './features/users/userPostsPage';
import TodoListPage from './features/todos/TodoListPage';
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Users />} />
        <Route path="/users/:userId" element={<UserPostsPage />} />
        <Route path="/tasks" element={<TodoListPage />} />
      </Route>
    </Routes>
  );
}

export default App;
