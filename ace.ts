import '#start/db'
import { Migration } from '#core/migration';
import { Command } from 'commander';

const program = new Command();

program
  .name('ace')
  .description('A simple cli for the framework')
  .version('1.0.0');

program
  .command('migration:run')
  .description('Run all migrations')
  .action(async () => {
    const migration = new Migration()
    await migration.up()
  });

program
  .command('migration:rollback')
  .description('Rollback the last migration')
  .action(async () => {
    const migration = new Migration()
    await migration.down()
  });

program.parse(process.argv);