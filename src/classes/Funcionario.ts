import { carregarDados, salvarDados } from "../arquivos"
import { NivelPermissao } from "../enums"

export class Funcionario{
    public id: string
    public nome: string
    public telefone: string
    public endereco: string
    public usuario: string
    private senha: string
    public nivelPermissao: NivelPermissao

    constructor(nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao, id?: string){
        this.id = id || ""
        this.nome = nome
        this.telefone = telefone
        this.endereco = endereco
        this.usuario = usuario
        this.senha = senha
        this.nivelPermissao = nivelPermissao
    }

    autenticar(usuario: string, senha: string): boolean{
        return  this.usuario === usuario && this.senha === senha
    }

    async salvar(): Promise<void> {
        if (!this.id) {
            await this.initId()
        }
        await salvarDados("funcionarios.json", this)
    }

    static async carregarTodos(): Promise<Funcionario[]>{
        const dados = await carregarDados("funcionarios.json")
        return dados.map(
            (f: any) =>
                new Funcionario(f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao, f.id)
        )
    }

    private async initId(): Promise<void> {
        if (!this.id) {
            const funcionarios = await carregarDados("funcionarios.json")
            const ids = funcionarios.map((f: any) => parseInt(f.id)).filter((n: any) => !isNaN(n))
            const novoId = ids.length ? Math.max(...ids) + 1 : 1
            this.id = novoId.toString()
        }
    }
}