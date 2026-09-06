import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <HospitalProvider>
            <ToastProvider>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </ToastProvider>
          </HospitalProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

