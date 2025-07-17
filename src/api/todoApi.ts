import axios from 'axios';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/todos'
  );
  return response.data;
};
