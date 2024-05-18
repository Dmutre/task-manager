export default () => ({
  port: parseInt(process.env.PORT),
  db: {
    db_host: process.env.DATABASE_HOST,
    db_port: parseInt(process.env.DATABASE_PORT),
    db_password: process.env.DATABASE_PASSWORD,
    db_name: process.env.DATABASE_NAME,
    db_user: process.env.DATABASE_USER,
    db_type: process.env.DATABASE_TYPE,
  },
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_refresh_ttl: process.env.JWT_REFRESH_TTL,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
  frontend: {
    url: process.env.FRONTEND_BASE_URL,
  },
});
