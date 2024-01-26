import chalk from 'chalk';

import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/lib/file-reader/index.js';
import { createRentalOffer, getErrorMessage } from '../../shared/lib/helpers/index.js';

export class ImportCommand implements Command {
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
