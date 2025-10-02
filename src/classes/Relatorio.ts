import { Aeronave } from "./Aeronave";
import fs from "fs";
import path from "path";

export class Relatorio {
    gerarRelatorio(aeronave: Aeronave): string {
//         let relatorio = `
// Relatório da Aeronave
// Código: ${aeronave.codigo}
// Modelo: ${aeronave.modelo}
// Tipo: ${aeronave.tipo}
// Capacidade: ${aeronave.capacidade}
// Alcance: ${aeronave.alcance}
// Peças: ${aeronave.pecas.map(p => p.nome).join(", ")}
// Etapas: ${aeronave.etapas.map(e => `${e.nome} - ${e.status}`).join("\n")}
// Testes: ${aeronave.testes.map(t => `${t.tipo} - ${t.resultado}`).join("\n")}
//         `;
    }

    salvarEmArquivo(conteudo: string, filename: string): void {
        // const pasta = path.join(__dirname, "./dados");

        // if (!fs.existsSync(pasta)){
        //     fs.mkdirSync(pasta)
        // }

        // fs.writeFileSync(path.join(pasta, filename), conteudo);
    }
}
