const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

const staticPath = path.join(__dirname, 'dist/web/browser');

app.use(express.static(staticPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`EcoCommune web app listening on port ${PORT}`);
});
