import dotenv from 'dotenv';

dotenv.config({
  path: process.env.DB_DIALECT === 'test' ? '.env.test' : '.env',
});
