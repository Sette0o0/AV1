import { StatusPeca, TipoPeca } from "../enums"

export class Peca{
    public nome: string
    public tipo: TipoPeca
    public fornecedor: string
    public status: StatusPeca

    constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca) {
        this.nome = nome
        this.tipo = tipo
        this.fornecedor = fornecedor
        this.status = status
    }

    set atualizarStatus(novoStatus: StatusPeca){
        this.status = novoStatus
    }

    salvar(): void{

    }

    carregar(): void{

    }
}