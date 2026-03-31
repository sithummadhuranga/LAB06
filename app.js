// app.js
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

const authRoutes = require('./routes/auth.routes');
const postsRoutes = require('./routes/posts.routes');
const viewRoutes = require('./routes/view.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers: {
      formatDate: (iso) =>
        new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      excerpt: (text) => (text && text.length > 140 ? `${text.slice(0, 140)}…` : text),
      upper: (str) => (str ? str.charAt(0).toUpperCase() : ''),
      inc: (n) => n + 1,
      dec: (n) => n - 1,
      eq: (a, b) => a === b,
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

app.use('/', viewRoutes);

app.get('/', (_req, res) => res.redirect('/feed'));

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  console.error(`[${status}]`, err.message);
  res.status(status).json({ success: false, error: err.message || 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`\n  🚀  SocialHub API ready`);
  console.log(`  ➜   Feed:   http://localhost:${PORT}/feed`);
  console.log(`  ➜   Posts:  http://localhost:${PORT}/api/posts\n`);
});
