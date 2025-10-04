import { readFile, writeFile, mkdir } from 'fs/promises'

export async function salvarDados(nomeArquivo: string, data: object, chave: string = "codigo") {
    try {
        await mkdir(`${__dirname}/dados/`, { recursive: true });
        const dadosAntigos: any[] = await carregarDados(nomeArquivo);

        const index = dadosAntigos.findIndex(d => d[chave] === (data as any)[chave]);
        if (index >= 0) {
            dadosAntigos[index] = data;
        } else {
            dadosAntigos.push(data);
        }

        await writeFile(`${__dirname}/dados/${nomeArquivo}`, JSON.stringify(dadosAntigos, null, 2), 'utf8');
    } catch (err) {
        console.log("Erro ao salvar:", err);
    }
}

export async function carregarDados(nomeArquivo: string) {
    try {
        const data = await readFile(`${__dirname}/dados/${nomeArquivo}`, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}