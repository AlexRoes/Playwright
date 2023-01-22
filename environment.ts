import dotenv from 'dotenv';
dotenv.config();

export default {
  baseUrl: process.env.BASE_URL as string,
  userApiKey: process.env.USER_API_KEY as string,
  userEmail: process.env.USER_EMAIL as string,
  userPassword: process.env.USER_PASSWORD as string,
};
