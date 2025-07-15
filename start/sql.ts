import database from '#config/database';
import { SQL } from 'bun';

export default new SQL(database);
