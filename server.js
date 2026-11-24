const PORT = process.env.PORT || 5000;
let ready;
function init() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET)
    return Promise.reject(new Error('Set MONGO_URI and JWT_SECRET'));
  if (!ready) ready = mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('✅ MongoDB connected');
    await ensureAdmin();
    seedDefaults().catch(e => console.error('Seed error:', e.message));
  });
  return ready;
}

// Local run (npm start) still works; Vercel skips this block
if (require.main === module) {
  init()
    .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`)))
    .catch(err => { console.error('❌', err.message); process.exit(1); });
}

module.exports = { app, parseRss, init };