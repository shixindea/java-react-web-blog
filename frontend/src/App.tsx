import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ArticleList from '@/pages/ArticleList';
import ArticleEditor from '@/pages/ArticleEditor';
import ArticleDetail from '@/pages/ArticleDetail';
import { useAuthStore } from '@/store/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-brand-primary">Blog System</Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <button 
                onClick={() => logout()}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <ArticleList />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/create-article" element={
          <ProtectedRoute>
            <Layout>
              <ArticleEditor />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/edit-article/:id" element={
          <ProtectedRoute>
            <Layout>
              <ArticleEditor />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/articles/:id" element={
          <ProtectedRoute>
            <Layout>
              <ArticleDetail />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
