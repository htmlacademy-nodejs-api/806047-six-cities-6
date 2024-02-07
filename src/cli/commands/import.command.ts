import chalk from 'chalk';

import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/lib/file-reader/index.js';
import { createRentalOffer, getErrorMessage } from '../../shared/helpers/index.js';
// import { UserService } from '../../shared/modules /user/index.js';
// import { Logger } from '../../shared/lib/logger/index.js';
// import { DatabaseClient } from '../../shared/lib/database-client/database-client.interface.js';
// import { DEFAULT_DB_PORT } from './command.constants.js';

export class ImportCommand implements Command {
  // private salt: string;
  // private userService: UserService;
  // private databaseClient: DatabaseClient;
  // private logger: Logger;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
  }


  public getName() {
    return '--import';
  }

  private onImportedLine(line: string) {
    const rentalOffer = createRentalOffer(line);
    console.info(rentalOffer);
  }

  private onCompleteImport(count: number) {
    console.info(chalk.bgCyanBright(`${count} rows imported.`));
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;

    // const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);

    // this.salt = salt;

    // await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error: unknown) {
      console.error(chalk.red(getErrorMessage(error)));
      console.error(chalk.bgRed(`Can't import data from file: ${filename}`));
    }
  }
}
