import { Command } from './command.interface.js';
import chalk from 'chalk';
import { TSVFileReader } from '../../shared/lib/file-reader/index.js';

export class ImportCommand implements Command {
  public getName() {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.info(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.bgRed(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${err.message}`));
    }
  }
}
