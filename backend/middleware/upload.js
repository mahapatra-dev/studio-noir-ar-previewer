const multer = require('multer');
const path = require('path');

function makeStorage(subfolder) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads', subfolder)),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });
}

const uploadModel = multer({
  storage: makeStorage('models'),
  fileFilter: (req, file, cb) => {
    const ok = ['.glb', '.gltf'].includes(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Only .glb/.gltf files allowed'), ok);
  },
});

const uploadImage = multer({
  storage: makeStorage('images'),
  fileFilter: (req, file, cb) => {
    const ok = /\.(jpg|jpeg|png|webp)$/i.test(file.originalname);
    cb(ok ? null : new Error('Only image files allowed'), ok);
  },
});

module.exports = { uploadModel, uploadImage };
