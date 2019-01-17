const multer  = require('multer');
const fs = require('fs');
const uuid = require('uuid');

const upload = multer({dest: `${__dirname}/../uploads/`}).single('file');
const image = ['jpg', 'jpeg', 'png', 'bmp'];

class AttController {
  async uploadFile(req, res) {
    if (!fs.existsSync(`${__dirname}/../uploads/`)) {
      fs.mkdirSync(`${__dirname}/../uploads/`);
    }
    upload(req, res, err => {
      if (err) {
        console.log(err);
        res.send({code: 500, message: '文件保存失败'});
        fs.unlinkSync(req.file.path, err3 => {
          console.log(err3);
        });
        return;
      }
      const fileName = req.file.originalname;
      const fileType = fileName.substr(fileName.indexOf('.') + 1, fileName.length).toLowerCase();
      if (image.indexOf(fileType) === -1) {
        res.send({
          code: 400,
          message: '上传文件不是图片'
        });
        fs.unlinkSync(req.file.path, err3 => {
          console.log(err3);
        });
        return;
      }
      const uid = uuid.v1();
      const tmp_path = req.file.path;
      const target_path = `${__dirname}/../uploads/${uid}.${fileType}`;
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on('end', () => {
        res.send({code: 0, path: `/uploads/${uid}.${fileType}`});
      });
      src.on('error', err2 => {
        res.end();
        console.log(err2);
        res.send({code: 500, message: '文件保存失败'});
      });
      fs.unlinkSync(tmp_path, err3 => {
        console.log(err3);
      });
    });
  }

  async view(req, res) {
    const filePath = `${__dirname}/..${req.query.path}`;
    fs.exists(filePath, exists => {
      if (!exists) {
        res.send({code: 400, message: '文件不存在'});
      } else {
        fs.readFile(filePath, 'binary', (err, file) => {
          if (err) {
            console.log(err);
            res.send({code: 500, message: '读取文件出错'});
          } else {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.write(file, 'binary');
            res.end();
          }
        });
      }
    });
  }
}

module.exports = new AttController();
