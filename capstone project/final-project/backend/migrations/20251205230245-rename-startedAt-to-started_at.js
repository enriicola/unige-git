export async function up({ context: queryInterface }) {
  await queryInterface.renameColumn('challenge', 'startedAt', 'started_at');
}

export async function down({ context: queryInterface }) {
  await queryInterface.renameColumn('challenge', 'started_at', 'startedAt');
}
