import React, { useState } from 'react';
import EventsTab from './Tabs/EventsTab';
import UsersTab from './Tabs/UsersTab';
import TicketsTab from './Tabs/TicketsTab';
import LogsTab from './Tabs/LogsTab';
import './AdminDashboard.css';

function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('events'); // 'events', 'users', 'tickets', 'logs'

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Tabs for Navigation */}
      <div className="admin-tabs">
        <button onClick={() => setCurrentTab('events')}>Manage Events</button>
        <button onClick={() => setCurrentTab('users')}>Manage Users</button>
        <button onClick={() => setCurrentTab('tickets')}>Manage Tickets</button>
        <button onClick={() => setCurrentTab('logs')}>View Logs</button>
      </div>

      {/* Conditional Rendering of Tabs */}
      {currentTab === 'events' && <EventsTab />}
      {currentTab === 'users' && <UsersTab />}
      {currentTab === 'tickets' && <TicketsTab />}
      {currentTab === 'logs' && <LogsTab />}
    </div>
  );
}

export default AdminDashboard;
