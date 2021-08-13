import * as newSudoku from './newSudoku.local-storage';
import * as options from './options.local-storage';
import * as status from './status.local-storage';
import * as sudokus from './sudokus.local-storage';
import * as users from './users.local-storage';
import { clearAll } from './common.local-storage';

export * from './common.local-storage';
export { clearAll, newSudoku, options, status, sudokus, users };
