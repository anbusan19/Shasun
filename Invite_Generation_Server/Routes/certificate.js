const express = require('express');
const router = express.Router();
const { uploadFiles, generateCertificate, generateCelebration } = require('../Controller/Celebration_controller');

// Route for generating regular invites
router.post('/generate', uploadFiles, generateCertificate);

// Route for generating celebration invites
router.post('/generate-celebration', uploadFiles, generateCelebration);

module.exports = router; 