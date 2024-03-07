import chalk from 'chalk';

import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/lib/file-reader/index.js';
import { createRentalOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { DEFAULT_DB_PORT } from './command.constants.js';
import { Logger, PinoLogger } from '../../shared/lib/logger/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/lib/database-client/index.js';
import { UserService, DefaultUserService, UserModel } from '../../shared/modules /user/index.js';
import { RentService, DefaultRentService, RentModel } from '../../shared/modules /rent/index.js';
import { RentalOffer } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  private salt: string;
  private userService: UserService;
  private rentService: RentService;
  private databaseClient: DatabaseClient;
  private logger: Logger;

  constructor() {
    this.logger = new PinoLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.rentService = new DefaultRentService(this.logger, RentModel, this.userService);
  }

  public getName() {
    return '--import';
  }

  private onImportedLine = async (line: string, resolver: () => void) => {
    const rentalOffer = createRentalOffer(line);
    await this.saveRentalOffer(rentalOffer);

    resolver();
  };

  private onCompleteImport = (count: number) => {
    console.info(chalk.bgCyanBright(`${count} rows imported.`));
  };

  async saveRentalOffer(rentOffer: RentalOffer) {
    const user = await this.userService.findOrCreate(rentOffer.user, this.salt);

    await this.rentService.create({
      ...rentOffer,
      userId: user.id
    });
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, login, password, host, dbname, salt] = parameters;

    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);

    this.salt = salt;
    await this.databaseClient.connect(uri);

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
