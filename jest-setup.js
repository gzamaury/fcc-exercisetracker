import { config as dotenvConfig } from 'dotenv';
import { existsSync } from 'fs';

if (existsSync('.env.test')) {
  dotenvConfig({ path: '.env.test' });
} else {
  process.env.MONGO_URI = process.env.MONGO_URI_TEST;
}
