const express = require('express');
const { uploadFiles, generateCertificate } = require('../Controller/Certificate_controller');

const router = express.Router();

router.post('/generate-certificate', uploadFiles, generateCertificate);

module.exports = router;
