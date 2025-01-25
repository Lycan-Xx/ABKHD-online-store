import React from 'react';
import { Edit2, Save, X } from 'lucide-react';

const SettingsPanel = ({ 
  settings, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onChange 
}) => {
  return (
    <section className="bg-gray-800 rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="text-yellow-400 hover:text-yellow-500 flex items-center gap-2"
          >
            <Edit2 size={20} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="text-green-400 hover:text-green-500 flex items-center gap-2"
            >
              <Save size={20} />
              Save
            </button>
            <button
              onClick={onCancel}
              className="text-red-400 hover:text-red-500 flex items-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">WhatsApp Number</label>
          <input
            type="text"
            value={settings.whatsappNumber}
            onChange={(e) => onChange('whatsappNumber', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Contact Email</label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => onChange('contactEmail', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
          />
        </div>
      </div>
    </section>
  );
};

export default SettingsPanel;