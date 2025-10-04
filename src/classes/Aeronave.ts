import { carregarDados, salvarDados } from "../arquivos"
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
        return `codigo: ${this.codigo}, modelo: ${this.modelo}, tipo: ${this.tipo}, capacidade: ${this.capacidade}, alcance: ${this.alcance}`
    }

    get getDetalhesCompleto(): string {
        let detalhes = `Código: ${this.codigo}
Modelo: ${this.modelo}
Tipo: ${this.tipo}
Capacidade: ${this.capacidade}
Alcance: ${this.alcance}\n`;

        detalhes += `\nPeças:\n`;
        if (this.pecas.length > 0) {
            this.pecas.forEach((p, i) => {
                detalhes += `${i + 1}. ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}\n`;
            });
        } else {
            detalhes += "Nenhuma peça cadastrada.\n";
        }

        detalhes += `\nEtapas:\n`;
        if (this.etapas.length > 0) {
            this.etapas.forEach((e, i) => {
                const funcionarios = e.funcionarios.map(f => f.nome).join(", ") || "Nenhum";
                detalhes += `${i + 1}. ${e.nome} | Prazo: ${e.prazo} | Status: ${e.status} | Funcionários: ${funcionarios}\n`;
            });
        } else {
            detalhes += "Nenhuma etapa cadastrada.\n";
        }

        detalhes += `\nTestes:\n`;
        if (this.testes.length > 0) {
            this.testes.forEach((t, i) => {
                detalhes += `${i + 1}. Tipo: ${t.tipo} | Resultado: ${t.resultado}\n`;
            });
        } else {
            detalhes += "Nenhum teste cadastrado.\n";
        }

        return detalhes;
    }

    async salvar(): Promise<boolean> {
        const aeronaves = await Aeronave.carregarTodos()

        const existe = aeronaves.some(a => a.codigo === this.codigo)
        if (existe) return false

        await salvarDados("aeronaves.json", this)
        return true
    }

    async editar(): Promise<void> {
        await salvarDados("aeronaves.json", this);
    }

    static async carregarTodos(): Promise<Aeronave[]> {
        const dados = await carregarDados("aeronaves.json")
        return dados.map((a: any) => {
            const aeronave = new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance)
            aeronave.pecas = (a.pecas || []).map((p: any) => new Peca(p.nome, p.tipo, p.fornecedor, p.status));
            aeronave.etapas = (a.etapas || []).map((e: any) => {
                const etapa = new Etapa(e.nome, e.prazo);
                etapa.status = e.status;
                etapa.funcionarios = e.funcionarios || [];
                return etapa;
            });
            aeronave.testes = (a.testes || []).map((t: any) => new Teste(t.tipo, t.resultado));
            return aeronave
        })
    }
}