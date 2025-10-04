import { writeFile, mkdir } from "fs/promises";
import { Aeronave } from "./Aeronave";

export class Relatorio {
  static async gerar(aeronave: Aeronave, cliente: string, dataEntrega: string) {
    let texto = `Relatório de Entrega da Aeronave\n`;
    texto += `Cliente: ${cliente}\nData de entrega: ${dataEntrega}\n\n`;
    texto += aeronave.getDetalhesCompleto;

    const nomeArquivo = `relatorio_${aeronave.codigo}.txt`;
    await mkdir(`${__dirname.replace('classes', 'relatorios')}/`, { recursive: true });
    await writeFile(`${__dirname.replace('classes', 'relatorios')}/${nomeArquivo}`, texto, 'utf8');
    return nomeArquivo;
  }
}
