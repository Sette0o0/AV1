import { StatusEtapa } from "../enums"
import { Funcionario } from "./Funcionario"

export class Etapa{
    public nome: string
    public prazo: string
    public status: StatusEtapa
    public funcionarios: Funcionario[]

    constructor(nome: string, prazo: string, status: StatusEtapa){
        this.nome = nome
        this.prazo = prazo
        this.status = status
        this.funcionarios = []
    }

    iniciar(): void{

    }

    finalizar(): void{

    }

    associarFuncionario(f: Funcionario): void{
        this.funcionarios.push(f)
    }

    listarFuncionarios(): Funcionario[]{
        return this.funcionarios
    }
}