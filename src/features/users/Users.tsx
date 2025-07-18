import { useEffect } from 'react';
import { fetchUsers } from './userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import UserForm from './UserForm';
import { Button, Collapse } from 'antd';
import { Link } from 'react-router';

export default function Users() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (list.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  const listForDisplay = list.map((user, index) => ({
    ...user,
    key: index,
    label: user.name,
    children: (
      <>
        <UserForm user={user} key={user.id} />
        <Link to={`/users/${user.id}`}>
          <Button type="link">See {`${user.name}'s`} comments</Button>
        </Link>
      </>
    ),
  }));
  return (
    <div>
      <h2>User List</h2>
      <Collapse items={listForDisplay} />
    </div>
  );
}
