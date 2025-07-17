import { useEffect, useState } from 'react';
import { updateUser } from './userSlice';
import { useAppDispatch } from '../../hooks';
import { Button, Flex, Input } from 'antd';
import styles from './UserForm.module.css';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  user: User;
}

export default function UserCard({ user }: Props) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  useEffect(() => {
    if (!name.trim()) {
      setNameError('Name is required.');
    } else {
      setNameError('');
    }
  }, [name]);

  useEffect(() => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  }, [email]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleRevert = () => {
    setName(user.name);
    setEmail(user.email);
  };

  const hasErrors = () => {
    return nameError.length > 0 || emailError.length > 0;
  };

  const isChanged = () => {
    return user.name !== name || user.email !== email;
  };

  const handleSave = () => {
    if (hasErrors()) {
      return;
    }

    dispatch(updateUser({ id: user.id, name, email }));
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.line}>
        <Flex justify="space-between" align="center" gap="small">
          <div className={styles.lineTitle}>
            <label htmlFor="name">Name:</label>
          </div>
          <Input
            id="name"
            className={styles.input}
            type="text"
            status={nameError ? 'error' : ''}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleNameChange(e.target.value)
            }
          />
        </Flex>
        {nameError && <p className={styles.error}>{nameError}</p>}
      </div>
      <div className={styles.line}>
        <Flex justify="space-between" align="center" gap="small">
          <div className={styles.lineTitle}>
            <label htmlFor="email">Email:</label>
          </div>
          <Input
            id="email"
            className={styles.input}
            type="email"
            status={emailError ? 'error' : ''}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleEmailChange(e.target.value)
            }
          />
        </Flex>
        {emailError && <p className={styles.error}>{emailError}</p>}
      </div>
      <div className={styles.actions}>
        <Button
          className={styles.button}
          onClick={handleSave}
          style={{ marginTop: 8 }}
          disabled={hasErrors() || !isChanged()}
          size="small">
          Submit
        </Button>
        <Button
          className={styles.button}
          onClick={() => handleRevert()}
          style={{ marginTop: 8 }}
          disabled={!isChanged()}
          size="small">
          Revert
        </Button>
      </div>
    </div>
  );
}
