import React, { useState, useEffect } from 'react';
import { User } from './types';
import UserSelection from './components/UserSelection';
import Layout from './components/Layout';
import PostTracker from './components/PostTracker';
import TaskTracker from './components/TaskTracker';
import ReportTracker from './components/ReportTracker';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedUser = sessionStorage.getItem('logged_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('logged_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('logged_user');
    setActiveTab('dashboard');
  };

  if (!currentUser) {
    return <UserSelection onSelect={handleLogin} />;
  }

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'linkedin' && <PostTracker user={currentUser} />}
        {activeTab === 'tasks' && <TaskTracker user={currentUser} />}
        {activeTab === 'reports' && <ReportTracker user={currentUser} />}
      </div>
    </Layout>
  );
};

export default App;