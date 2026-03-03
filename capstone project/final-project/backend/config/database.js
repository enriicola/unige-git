export default {
  name: process.env.DB_NAME || 'codymatch',
  user: process.env.DB_USER || 'codymatch',
  // Ensure password is always a string (Sequelize requires string, not undefined)
  password:
    process.env.DB_PASSWORD != null
      ? String(process.env.DB_PASSWORD)
      : 'codymatch',
  options: {
    host: process.env.DB_HOST || 'localhost',
    // Default to 5431 which is the exposed port from Docker (5432 is container port)
    port: parseInt(process.env.DB_PORT || '5431', 10),
    dialect: 'postgres',
    freezeTableName: true,
    logging: process.env.SQL_LOGGING === 'true',
    define: {
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    pool: {
      max: 15,
    },
  },
};
