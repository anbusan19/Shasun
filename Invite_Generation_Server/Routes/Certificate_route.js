const express = require('express');
const router = express.Router();
const { uploadFiles: certificateUpload, generateCertificate } = require('../Controller/Certificate_controller');
const { uploadFiles: celebrationUpload, generateCelebration } = require('../Controller/Celebration_controller');

// Route for generating regular invites
router.post('/generate-certificate', certificateUpload, generateCertificate);

// Route for generating celebration invites
router.post('/generate-celebration', celebrationUpload, generateCelebration);

module.exports = router;
