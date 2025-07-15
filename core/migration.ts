import sql from '#start/sql';
import { readdir } from 'node:fs/promises';
import { logger } from '#core/logger';
import { snakeCase } from 'change-case';
import { Glob } from 'bun';
export class Migration {
  private migrationDir: string;

  constructor(migrationDir: string = '/db/migrations/') {
    this.migrationDir = (process.cwd() + '/' + migrationDir).replace('//', '/');
  }

  /**
   * Run all migrations
   */
  async up() {
    this.#createMigrationTableIfNotExists();
    const glob = new Glob("**/*up.sql");
    const fileList: string[] = []
    for await (const path of glob.scan(this.migrationDir)) {
      fileList.push(path)
    }
    const files = fileList.sort((a, b) => a.localeCompare(b));
    for (let file of files) {
      const filePath = this.migrationDir + file;
      const migration = file.replace(this.migrationDir, '').replace('/up.sql', '');
      const [exist] =
        await sql`SELECT 1 FROM migrations WHERE name = ${migration}`;
      if (exist) continue;
      logger.info(`Migrating ${migration} ...`);
      await sql.file(filePath);
      const [lastBatch] = await sql`SELECT MAX(batch) FROM migrations`;
      await sql`INSERT INTO migrations (name, batch) VALUES (${migration}, ${lastBatch.max || 0 + 1})`;
      logger.info(`Migrated ${migration}`);
    }
    logger.info(`Migrations completed`);
  }

  /**
   * Rollback all migrations
   */
  async down() {
    const ext = '/down.sql';
    const [lastBatch] = await sql`SELECT MAX(batch) FROM migrations`;
    const files =
      await sql`SELECT name FROM migrations where batch = ${lastBatch.max} ORDER BY id DESC LIMIT 1`;
    for (const file of files) {
      logger.info(`Rolling back ${file.name} ...`);
      const filePath = this.migrationDir + file.name + ext;
      await sql.file(filePath);
      await sql`DELETE FROM migrations WHERE name = ${file.name}`;
      logger.info(`Rolled back ${file.name}`);
    }
    logger.info(`Rollback completed`);
  }

  /**
   * Create migration table if not exists
   */
  async #createMigrationTableIfNotExists() {
    await sql`CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      batch INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
  }

  /**
   * Create a new migration file
   * @param name - The name of the migration
   */
  async createMigrationFile(name: string) {
    const extensions = ['down.sql', 'up.sql'];
    const folder = Date.now() + '_' + snakeCase(name);
    logger.info('Migration file created:');
    for (const ext of extensions) {
      const file = `${this.migrationDir}${folder}/${ext}`;
      logger.success(`${folder}/${ext}`);
      await Bun.write(file, '');
    }
  }
}
