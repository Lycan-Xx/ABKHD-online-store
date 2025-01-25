import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/settings';

const SettingsForm = ({ initialSettings, onSubmit }) => {
  const [settings, setSettings] = useState(initialSettings || { whatsappNumber: '', contactEmail: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(settings);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-200 mb-2">
          WhatsApp Number
        </label>
        <input
          type="text"
          id="whatsappNumber"
          name="whatsappNumber"
          value={settings.whatsappNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="+1234567890"
        />
      </div>

      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-200 mb-2">
          Contact Email
        </label>
        <input
          type="email"
          id="contactEmail"
          name="contactEmail"
          value={settings.contactEmail}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="contact@example.com"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};

const Admin = () => {
  const [settings, setSettings] = useState({
    whatsappNumber: '',
    contactEmail: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (settings) => {
    try {
      await updateSettings(settings);
      // Show success message
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <SettingsForm initialSettings={settings} onSubmit={handleSubmit} />
  );
};

export default SettingsForm;