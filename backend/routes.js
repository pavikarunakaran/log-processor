const express = require('express');
const multer = require('multer');
const logQueue = require('./queue');
const supabase = require('./supabase'); // Supabase client setup

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-logs', upload.single('logFile'), async (req, res) => {
  const filePath = req.file.path;
  const fileId = req.file.filename;

  await logQueue.add('process-log', { filePath, fileId });

  res.json({ jobId: fileId });
});

router.get('/stats', async (req, res) => {
  const { data, error } = await supabase.from('log_stats').select('*');
  res.json(data);
});

router.get('/stats/:jobId', async (req, res) => {
  const { data, error } = await supabase
    .from('log_stats')
    .select('*')
    .eq('fileId', req.params.jobId);
  console.log(data, req.params.jobId)
  res.json(data);
});

router.get('/queue-status', async (req, res) => {
  const counts = await logQueue.getJobCounts();
  res.json(counts);
});

module.exports = router;