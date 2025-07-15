import '#start/sql';
import { Migration } from '#core/migration';
import { Command } from 'commander';
import { Ace } from '#core/ace';

const program = new Command();
const migration = new Migration();
const ace = new Ace();

program
  .name('ace')
  .description('A simple cli for the framework')
  .version('1.0.0');

program
  .command('migration:run')
  .description('Run all migrations')
  .action(async () => {
    await migration.up();
  });

program
  .command('migration:rollback')
  .description('Rollback the last migration')
  .action(async () => {
    await migration.down();
  });

program
  .command('create:migration')
  .description('Create a new migration file')
  .argument('<name>', 'The name of the migration')
  .action(async (name) => {
    await migration.createMigrationFile(name);
  });

program
  .command('create:middleware')
  .description('Create a new middleware file')
  .argument('<name>', 'The name of the middleware')
  .action(async (name) => {
    await ace.createMiddleware(name);
  });

program.parse(process.argv);
