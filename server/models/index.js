import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import conf from '../../server/config/config.json';

// loads the environment variables for the DB
dotenv.config();

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = conf[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], { dialect: 'postgres' });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
