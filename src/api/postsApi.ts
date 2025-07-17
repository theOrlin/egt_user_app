import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const fetchPostsByUser = async (userId: number): Promise<Post[]> => {
  const response = await axios.get(`${BASE_URL}/posts?userId=${userId}`);
  return response.data;
};

export const updatePost = async (post: Post): Promise<Post> => {
  const response = await axios.put(`${BASE_URL}/posts/${post.id}`);
  return response.data;
};

export const deletePost = async (postId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/posts/${postId}`);
};
