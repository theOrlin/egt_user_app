import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router';
import styles from './MainLayout.module.css';

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string>(
    location.pathname.substring(1) || 'users'
  );

  const setSelected = ({ key }: { key: string }) => {
    setCurrentPage(key);
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerTitle}>Users App</div>
        <Menu
          className={styles.menu}
          onClick={setSelected}
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPage]}
          items={[
            { label: <Link to="/">Users</Link>, key: 'users' },
            { label: <Link to="/tasks">Tasks</Link>, key: 'tasks' },
          ]}
        />
      </Header>

      <Layout className={styles.pageLayout}>
        <Content className={styles.pageContent}>
          <Outlet />
        </Content>
        <Footer className={styles.footer}>
          Users App ©2025 Created for EGT by Orlin Ivanov
        </Footer>
      </Layout>
    </Layout>
  );
}
