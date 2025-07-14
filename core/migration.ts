import sql from "#start/sql";
import { readdir } from "node:fs/promises";
import { logger } from "#core/logger";

export class Migration {
  private migrationDir: string;

  constructor(migrationDir: string = '/db/migrations/') {
    this.migrationDir = (process.cwd() + '/' + migrationDir).replace('//', '/')
  }

  /**
   * Run all migrations
   */
  async up() {
    this.#createMigrationTableIfNotExists()
    const files = await readdir(this.migrationDir, { recursive: true });
    const ext = '.up.sql'
    for (let file of files) {
      if (file.includes(ext)) {
        file = file.replace(ext, '')
        const filePath = this.migrationDir + file + ext
        const [exist] = await sql`SELECT 1 FROM migrations WHERE name = ${file}`
        if (exist) continue
        logger.info(`Migrating ${file} ...`)
        await sql.file(filePath)
        const [lastBatch] = await sql`SELECT MAX(batch) FROM migrations`
        await sql`INSERT INTO migrations (name, batch) VALUES (${file}, ${lastBatch.max || 0 + 1})`
        logger.info(`Migrated ${file}`)
      }
    }
    logger.info(`Migrations completed`)
  }

  /**
   * Rollback all migrations
   */
  async down() {
    const ext = '.down.sql'
    const [lastBatch] = await sql`SELECT MAX(batch) FROM migrations`
    const files = await sql`SELECT name FROM migrations where batch = ${lastBatch.max} ORDER BY id DESC LIMIT 1`
    for (const file of files) {
      logger.info(`Rolling back ${file.name} ...`)
      const filePath = this.migrationDir + file.name + ext
      await sql.file(filePath)
      await sql`DELETE FROM migrations WHERE name = ${file.name}`
      logger.info(`Rolled back ${file.name}`)
    }
    logger.info(`Rollback completed`)
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
    )`
  }
}