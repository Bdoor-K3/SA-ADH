import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EventsTab from './Tabs/EventsTab';
import UsersTab from './Tabs/UsersTab';
import TicketsTab from './Tabs/TicketsTab';
import LogsTab from './Tabs/LogsTab';
import ContactTab from './Tabs/ContactTab';
import './AdminDashboard.css';

/**
 * AdminDashboard Component
 * Manages the admin panel with tabs for managing events, users, tickets, logs, and contacts.
 */
function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('events'); // State to track the active tab
  const { t } = useTranslation(); // Translation hook for multi-language support

  // Define tabs with keys and labels for translation
  const tabs = [
    { key: 'events', label: t('adminDashboard.tabs.events') },
    { key: 'users', label: t('adminDashboard.tabs.users') },
    { key: 'tickets', label: t('adminDashboard.tabs.tickets') },
    { key: 'logs', label: t('adminDashboard.tabs.logs') },
    { key: 'contacts', label: t('adminDashboard.tabs.contacts') },
  ];

  /**
   * Handles tab switching.
   * @param {string} tabKey - The key of the selected tab.
   */
  const handleTabChange = (tabKey) => {
    if (tabs.some((tab) => tab.key === tabKey)) {
      setCurrentTab(tabKey);
    } else {
      console.error('Invalid tab key:', tabKey);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Dashboard Title */}
      <h1>{t('adminDashboard.title')}</h1>

      {/* Tabs for Navigation */}
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={currentTab === tab.key ? 'active' : ''}
            aria-selected={currentTab === tab.key}
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
        {currentTab === 'contacts' && <ContactTab />}
      </div>
    </div>
  );
}

export default AdminDashboard;
