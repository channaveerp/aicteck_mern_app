import { app } from './app.js';
import cloudinary from 'cloudinary';

const port = process.env.PORT || 5000;
const cloudname = process.env.CLODINARY_CLOUD_NAME;
const cloudApikey = process.env.CLODINARY_API_KEY;
const cloudSecretkey = process.env.CLODINARY_API_SECRET;

console.log(cloudname, cloudSecretkey, cloudApikey);

app.get('/', (req, res) => {
  res.status(200).send('<h1>Home page</h1>');
});

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});
