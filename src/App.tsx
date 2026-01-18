import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import FamilyTree from './components/Tree/FamilyTree';
import { LoginPage } from './components/Auth/LoginPage';
import { FamilySelector } from './components/Family/FamilySelector';
import OAuthCallback from './components/Auth/OAuthCallback';
import JoinFamilyPage from './components/Family/JoinFamilyPage';
import { useStore } from './store/useStore';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import Header from './components/UI/Header';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthChecked } = useStore();
  const location = useLocation();

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main App Layout Logic
const MainLayout = () => {
  const { currentFamily } = useStore();

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 overflow-hidden relative">
          {!currentFamily ? <FamilySelector /> : <FamilyTree />}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

import { Toaster } from 'react-hot-toast';

function App() {
  const { checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        } />

        <Route path="/join" element={
          <ProtectedRoute>
            <JoinFamilyPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
