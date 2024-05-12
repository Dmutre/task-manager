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
  jwt: {},
});
