import { StatusEtapa } from "../enums"
import { Funcionario } from "./Funcionario"

export class Etapa {
    public nome: string
    public prazo: string
    public status: StatusEtapa
    public funcionarios: Funcionario[]

    constructor(nome: string, prazo: string) {
        this.nome = nome
        this.prazo = prazo
        this.status = StatusEtapa.PENDENTE
        this.funcionarios = []
    }

    iniciar(etapasExistentes: Etapa[]): boolean {
        const index = etapasExistentes.findIndex(e => e.nome === this.nome);
        if (index > 0 && etapasExistentes[index - 1].status !== StatusEtapa.CONCLUIDA) {
            return false;
        }
        this.status = StatusEtapa.ANDAMENTO;
        return true;
    }

    finalizar(etapasExistentes: Etapa[]): boolean {
        const index = etapasExistentes.findIndex(e => e.nome === this.nome)
        if (index > 0) {
            const etapaAnterior = etapasExistentes[index - 1]
            if (etapaAnterior.status !== StatusEtapa.CONCLUIDA) {
                return false
            }
        }
        this.status = StatusEtapa.CONCLUIDA
        return true
    }

    associarFuncionario(f: Funcionario): void {
        this.funcionarios.push(f)
    }

    listarFuncionarios(): Funcionario[] {
        return this.funcionarios
    }
}
