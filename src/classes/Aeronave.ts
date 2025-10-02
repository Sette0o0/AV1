import { TipoAeronave } from "../enums"
import { Etapa } from "./Etapa"
import { Peca } from "./Peca"
import { Teste } from "./Teste"

export class Aeronave{
    public codigo: string
    public modelo: string
    public tipo: TipoAeronave
    public capacidade: number
    public alcance: number
    public pecas: Peca[]
    public etapas: Etapa[]
    public testes: Teste[]

    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number){
        this.codigo = codigo
        this.modelo = modelo
        this.tipo = tipo
        this.capacidade = capacidade
        this.alcance = alcance
        this.pecas = []
        this.etapas = []
        this.testes = []
    }

    addPecas(peca: Peca){
        this.pecas.push(peca)
    }

    addEtapa(etapa: Etapa){
        this.etapas.push(etapa)
    }

    addTeste(teste: Teste){
        this.testes.push(teste)
    }

    get getDetalhes(): string{
        return `
codigo: ${this.codigo}, modelo: ${this.modelo}, tipo: ${this.tipo}, capacidade: ${this.capacidade}, alcance: ${this.alcance}
`
    }

    salvar(): void{

    }

    carregar(): void{

    }
}