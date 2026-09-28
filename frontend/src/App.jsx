import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetails from './pages/EmployeeDetails';
import MLPrediction from './pages/MLPrediction';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Protected View: If no user is logged in, show Login Page
  if (!user) {
    return <LoginPage />;
  }

  const handleSelectEmployee = (empId) => {
    setSelectedEmployeeId(empId);
  };

  const getPageInfo = () => {
    if (selectedEmployeeId && currentTab === 'employees') {
      return {
        title: 'Employee Profile & Diagnostics',
        subtitle: 'Individual performance driver breakdown and historical metrics'
      };
    }
    switch (currentTab) {
      case 'dashboard':
        return {
          title: 'Welcome back 👋',
          subtitle: "Here's your employee performance overview."
        };
      case 'employees':
        return {
          title: 'Employees Directory',
          subtitle: 'Manage employee records stored in PostgreSQL database'
        };
      case 'analytics':
        return {
          title: 'Performance Analysis',
          subtitle: 'Identify and analyze employee performance groups across metrics'
        };
      case 'prediction':
        return {
          title: 'Performance Prediction',
          subtitle: 'Predict employee performance using Machine Learning.'
        };
      case 'insights':
        return {
          title: 'AI Predictive Insights',
          subtitle: 'Synthesized statistical correlations and key workplace trends'
        };
      case 'reports':
        return {
          title: 'HR Reports & Exports',
          subtitle: 'Download complete CSV dataset reports and evaluation summaries'
        };
      case 'settings':
        return {
          title: 'Settings & System Preferences',
          subtitle: 'Manage user credentials, AI parameters, and database state'
        };
      default:
        return { title: 'EMPlytic', subtitle: 'AI Employee Performance Analytics' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="min-h-screen bg-[#fbfafd] flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedEmployeeId(null);
        }}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          setMobileOpen={setMobileOpen}
        />

        <main className="p-6 lg:p-10 flex-1">
          {currentTab === 'dashboard' && (
            <Dashboard
              setCurrentTab={setCurrentTab}
              setSelectedEmployeeId={handleSelectEmployee}
            />
          )}

          {currentTab === 'employees' && (
            selectedEmployeeId ? (
              <EmployeeDetails
                employeeId={selectedEmployeeId}
                onBack={() => setSelectedEmployeeId(null)}
                setCurrentTab={setCurrentTab}
              />
            ) : (
              <Employees
                onSelectEmployee={handleSelectEmployee}
                setCurrentTab={setCurrentTab}
              />
            )
          )}

          {currentTab === 'analytics' && <Analytics />}
          {currentTab === 'prediction' && <MLPrediction />}
          {currentTab === 'insights' && <Insights />}
          {currentTab === 'reports' && <Reports />}
          {currentTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
