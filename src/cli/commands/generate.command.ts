import got from 'got';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/mock-server-data.type.js';
import { TsvRentalOfferGenerator } from '../../shared/lib/rental-offer-generator/index.js';
import { TSVFileWriter } from '../../shared/lib/file-writer/index.js';
import chalk from 'chalk';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string): Promise<void> {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.error(`Can't load data from ${url}`);
    }
  }

  public getName() {
    return '--generate';
  }

  private async write(filepath: string, offerCount: number): Promise<void> {
    const tsvOfferGenerator = new TsvRentalOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filePath, url] = parameters;

    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filePath, offerCount);
      console.info(chalk.bgCyan('Generated data success'));
    } catch {
      console.error('Can\'t generate data');
    }
  }
}
