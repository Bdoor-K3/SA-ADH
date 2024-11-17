import React, { useState } from 'react';
import EventsTab from './Tabs/EventsTab';
import UsersTab from './Tabs/UsersTab';
import TicketsTab from './Tabs/TicketsTab';
import LogsTab from './Tabs/LogsTab';
import './AdminDashboard.css';

function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('events'); // 'events', 'users', 'tickets', 'logs'

  const tabs = [
    { key: 'events', label: 'Manage Events' },
    { key: 'users', label: 'Manage Users' },
    { key: 'tickets', label: 'Manage Tickets' },
    { key: 'logs', label: 'View Logs' },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Tabs for Navigation */}
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={currentTab === tab.key ? 'active' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conditional Rendering of Tabs */}
      <div className="tab-content">
        {currentTab === 'events' && <EventsTab />}
        {currentTab === 'users' && <UsersTab />}
        {currentTab === 'tickets' && <TicketsTab />}
        {currentTab === 'logs' && <LogsTab />}
      </div>
    </div>
  );
}

export default AdminDashboard;
