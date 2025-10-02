import { readFile, writeFile, mkdir } from 'fs/promises'

export async function salvarDados(nomeArquivo: string, data: object){
    try{
        await mkdir(`${__dirname}/dados/`, { recursive: true })
        await writeFile(`${__dirname}/dados/${nomeArquivo}`, JSON.stringify(data, null, 2), 'utf8');
    }
    catch{}
}

export async function carregarDados(nomeArquivo:string) {
    try{
        const data = await readFile(`${__dirname}/dados/${nomeArquivo}`, 'utf8')
        return JSON.parse(data)
    }
    catch{}
}

var dados = {
    "Funcionarios": [
        {
            "id": 3,
            "nome": "Rafael"
        },
        {
            "id": 5,
            "nome": "Rebeca"
        }
    ]
}

// salvarDados("teste1.json", dados)
async function main() {
    const dados = await carregarDados("teste.json")
    console.log(dados)
}

main()