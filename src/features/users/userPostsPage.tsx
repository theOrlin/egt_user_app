import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks';
import UserCard from './UserForm';
import { fetchUsers } from './userSlice';
import {
  type Post,
  fetchPostsByUser,
  updatePost,
  deletePost,
} from '../../api/postsApi';
import { Button, Input, Modal } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import styles from './userPostsPage.module.css';
import TextArea from 'antd/es/input/TextArea';

export default function UserPostsPage() {
  const dispatch = useAppDispatch();

  const { userId } = useParams<{ userId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editedPost, setEditedPost] = useState<Partial<Post>>({});
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [postForDeletion, setPostForDeletion] = useState<number | null>(null);

  const user = useAppSelector((state) =>
    state.users.list.find((userInList) => userInList.id === Number(userId))
  );

  useEffect(() => {
    // in case user lands here first, fetch new data so they don't see an empty page
    if (!user) {
      dispatch(fetchUsers());
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchPostsByUser(Number(userId)).then(setPosts).catch(console.error);
  }, [userId]);

  const handleEditPost = async (post: Post) => {
    setEditingPostId(post.id);
    setEditedPost(post);
  };

  const handlePostChange = (field: 'title' | 'body', value: string) => {
    setEditedPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePost = async () => {
    if (!editedPost.id || !editedPost.title || !editedPost.body) {
      return;
    }

    try {
      const updated = await updatePost(editedPost as Post);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === updated.id ? { ...post, ...editedPost } : post
        )
      );
      setEditingPostId(null);
      setEditedPost({});
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async () => {
    console.log('PostForDeletion', postForDeletion);
    try {
      if (postForDeletion) {
        await deletePost(postForDeletion);
        setPosts((prev) => prev.filter((post) => post.id !== postForDeletion));

        setPostForDeletion(null);
        setShowWarningModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = (postId: number) => {
    setPostForDeletion(postId);
    setShowWarningModal(true);
  };

  return user ? (
    <div>
      <Link to="/">
        <Button type="text">← Go Home</Button>
      </Link>
      <h2 className={styles.postsheading}>User</h2>
      <UserCard user={user} />
      <div>
        <h3 className={styles.postsTitle}>
          Posts by <span className={styles.bold}>{user.name}</span>
        </h3>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            {editingPostId === post.id ? (
              <>
                <div className={styles.line}>
                  <Input
                    type="text"
                    value={editedPost.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePostChange('title', e.target.value)
                    }
                    placeholder="Title"
                  />
                </div>
                <div className={styles.line}>
                  <TextArea
                    value={editedPost.body}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePostChange('body', e.target.value)
                    }
                    placeholder="Body"
                  />
                </div>
                <div className={styles.actions}>
                  <Button
                    className={styles.button}
                    size="small"
                    onClick={handleSavePost}>
                    Save
                  </Button>
                  <Button
                    className={styles.button}
                    size="small"
                    onClick={() => setEditingPostId(null)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h4>{post.title}</h4>
                <p>{post.body}</p>
                <div className={styles.actions}>
                  <Button
                    className={styles.button}
                    size="small"
                    onClick={() => handleEditPost(post)}>
                    Edit
                  </Button>
                  <Button
                    className={styles.button}
                    size="small"
                    onClick={() => onDelete(post.id)}>
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <Modal
        title={
          <span>
            <WarningFilled style={{ color: 'orange' }} /> DELETE?
          </span>
        }
        open={showWarningModal}
        onOk={handleDeletePost}
        onCancel={() => setShowWarningModal(false)}
        okText="Delete!"
        cancelText="Cancel">
        <p>Truly?</p>
      </Modal>
    </div>
  ) : (
    <p>User not found.</p>
  );
}
