import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Analyze from './pages/Analyze';
import History from './pages/History';
import About from './pages/About';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function App() {
  const [user, setUser] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex space-x-1 rounded-xl bg-primary-900/20 p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-primary-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                Upload Resume
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-primary-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                Analyze Resume
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-primary-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                History
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-primary-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                About
              </Tab>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </Tab.List>
            <Tab.Panels className="mt-8">
              <Tab.Panel>
                <Upload user={user} />
              </Tab.Panel>
              <Tab.Panel>
                <Analyze user={user} />
              </Tab.Panel>
              <Tab.Panel>
                <History user={user} />
              </Tab.Panel>
              <Tab.Panel>
                <About />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </Router>
  );
}

export default App; 