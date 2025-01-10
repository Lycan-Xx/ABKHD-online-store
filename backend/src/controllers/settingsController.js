import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings || { whatsappNumber: '', contactEmail: '' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { whatsappNumber, contactEmail } = req.body;
    
    const settings = await Settings.findOne();
    if (settings) {
      settings.whatsappNumber = whatsappNumber;
      settings.contactEmail = contactEmail;
      await settings.save();
    } else {
      await Settings.create({ whatsappNumber, contactEmail });
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
};