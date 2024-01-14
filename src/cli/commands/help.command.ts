import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.bgCyan('Программа для подготовки данных для REST API сервера.')}
        Пример:
          ${chalk.bgBlue('cli.js --<command> [--arguments]')}
        Команды:
            ${chalk.bgRed('--version')}:                   ${chalk.bgCyanBright('# выводит номер версии')}
            ${chalk.bgRed('--help')}:                      ${chalk.bgCyanBright('# печатает этот текст')}
            ${chalk.bgRed('--import <path>')}:             ${chalk.bgCyanBright('# импортирует данные из TSV')}
            ${chalk.bgRed('--generate <n> <path> <url>')}  ${chalk.bgCyanBright('# генерирует произвольное количество тестовых данных')}
    `);
  }
}

