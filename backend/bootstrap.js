'use strict';

const fs = require('fs');
const path = require('path');

module.exports = async () => {
  // Créer le dossier uploads s'il n'existe pas
  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}; 