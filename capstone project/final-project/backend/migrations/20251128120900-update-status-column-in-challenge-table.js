export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_challenge_status" ADD VALUE IF NOT EXISTS 'assigned';
    ALTER TYPE "enum_challenge_status" ADD VALUE IF NOT EXISTS 'started';
    ALTER TYPE "enum_challenge_status" ADD VALUE IF NOT EXISTS 'ended';
  `);
}

export async function down() {
  // Note: Sequelize does not support removing enum values directly.
}
