import readline from "readline";
import { Funcionario } from "./classes/Funcionario";
import { NivelPermissao, ResultadoTeste, StatusEtapa, StatusPeca, TipoAeronave, TipoPeca, TipoTeste } from "./enums";
import { Aeronave } from "./classes/Aeronave";
import { Peca } from "./classes/Peca";
import { Etapa } from "./classes/Etapa";
import { Teste } from "./classes/Teste";
import { Relatorio } from "./classes/Relatorio";

let funcionarioLogado: Funcionario | null = null;
let aeronaveSelecionada: Aeronave | null = null;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'CLI> '
});

function pergunta(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

function checarPermissao(acao: string): boolean {
    if (!funcionarioLogado) return false;

    const permissoes: Record<NivelPermissao, string[]> = {
        [NivelPermissao.ADMINISTRADOR]: ["cadastrarFuncionario","cadastrarAeronave","cadastrarPeca","cadastrarEtapa","associarFuncionario","alterarStatus","registrarTeste","gerarRelatorio"],
        [NivelPermissao.ENGENHEIRO]: ["cadastrarAeronave","cadastrarPeca","cadastrarEtapa","associarFuncionario","alterarStatus","registrarTeste","gerarRelatorio"],
        [NivelPermissao.OPERADOR]: ["alterarStatus","registrarTeste"]
    };

    return permissoes[funcionarioLogado.nivelPermissao]?.includes(acao) || false;
}

async function login(): Promise<Funcionario | null> {
    console.log("-".repeat(7), "Login", "-".repeat(7));
    const usuario = await pergunta("Usuário: ");
    const senha = await pergunta("Senha: ");
    const funcionarios = await Funcionario.carregarTodos();
    const f = funcionarios.find(f => f.autenticar(usuario, senha));
    if(f) {
        console.log(`Login bem-sucedido! Bem-vindo, ${f.nome}.`);
        return f;
    } else {
        console.log("Usuário ou senha inválidos.");
        return null;
    }
}

let menuAtual: "principal" | "funcionarios" | "aeronaves" | "aeronaveSelecionada" = "principal";

function mostrarMenuPrincipal() {
    console.log(`\nMenu Principal:
1 - Funcionários
2 - Aeronaves
3 - Usuário Atual
0 - Sair
`);
    rl.prompt();
    menuAtual = "principal";
}

function mostrarMenuFuncionarios() {
    console.log(`\nMenu Funcionários:
1 - Cadastrar Funcionário
2 - Listar Funcionários
0 - Voltar
`);
    rl.prompt();
    menuAtual = "funcionarios";
}

function mostrarMenuAeronaves() {
    console.log(`\nMenu Aeronaves:
1 - Cadastrar Aeronave
2 - Listar Aeronaves
0 - Voltar
`);
    rl.prompt();
    menuAtual = "aeronaves";
}

function mostrarMenuAeronaveSelecionada() {
    if(!aeronaveSelecionada) {
        console.log("Nenhuma aeronave selecionada.");
        mostrarMenuAeronaves();
        return;
    }

    console.log(`\n--- Aeronave ${aeronaveSelecionada.codigo} (${aeronaveSelecionada.modelo}) ---`);
    console.log(`1 - Cadastrar Peça
2 - Alterar Status de Peça
3 - Cadastrar Etapa
4 - Alterar Status de Etapa
5 - Cadastrar Teste
6 - Listar Detalhes
7 - Gerar Relatório
0 - Voltar
`);
    rl.prompt();
    menuAtual = "aeronaveSelecionada";
}

async function listarFuncionarios() {
    return await Funcionario.carregarTodos();
}

async function listarAeronaves() {
    const aeronaves = await Aeronave.carregarTodos();
    if(aeronaves.length === 0){
        console.log("Nenhuma aeronave cadastrada.");
        mostrarMenuAeronaves();
        return;
    }
    aeronaves.forEach((a, i) => console.log(`${i+1} - ${a.codigo} | ${a.modelo} | ${a.tipo}`));
    const escolha = await pergunta("Escolha o número da aeronave para gerenciar ou 0 para voltar: ");
    const index = parseInt(escolha) - 1;
    if(escolha === "0") { mostrarMenuAeronaves(); return; }
    if(index >=0 && index < aeronaves.length){
        aeronaveSelecionada = aeronaves[index];
        mostrarMenuAeronaveSelecionada();
    } else {
        console.log("Opção inválida.");
        mostrarMenuAeronaves();
    }
}

async function cadastrarFuncionario(isPrimeiro?: boolean) {
    if(!isPrimeiro && !checarPermissao("cadastrarFuncionario")) { 
        console.log("Você não tem permissão."); 
        return; 
    }

    console.log('-'.repeat(7), 'Cadastro de Funcionário', '-'.repeat(7));
    const nome = await pergunta("Nome: ");
    const telefone = await pergunta("Telefone: ");
    const endereco = await pergunta("Endereço: ");
    const usuario = await pergunta("Usuário: ");
    const senha = await pergunta("Senha: ");

    const escolhaNivel = await pergunta(`Tipo de funcionário:
1 - ${NivelPermissao.ADMINISTRADOR}
2 - ${NivelPermissao.ENGENHEIRO}
3 - ${NivelPermissao.OPERADOR}
CLI> `);
    let nivel: NivelPermissao = NivelPermissao.OPERADOR;
    switch(escolhaNivel){
        case '1': nivel = NivelPermissao.ADMINISTRADOR; break;
        case '2': nivel = NivelPermissao.ENGENHEIRO; break;
        case '3': nivel = NivelPermissao.OPERADOR; break;
        default: console.log("Opção inválida. Usando Operador.");
    }

    const f = new Funcionario(nome, telefone, endereco, usuario, senha, nivel);
    await f.salvar();
    console.log(`Funcionário ${f.nome} cadastrado com sucesso!`);
    if(!isPrimeiro) mostrarMenuFuncionarios();
}

async function cadastrarAeronave() {
    if(!checarPermissao("cadastrarAeronave")) { console.log("Você não tem permissão."); return; }

    console.log('-'.repeat(7), 'Cadastro de Aeronave', '-'.repeat(7));
    const codigo = await pergunta("Código: ");
    const modelo = await pergunta("Modelo: ");
    const capacidade = parseInt(await pergunta("Capacidade: "));
    const alcance = parseInt(await pergunta("Alcance (km): "));

    const tipoInput = await pergunta(`Tipo:
1 - Comercial
2 - Militar
CLI> `);
    const tipo = tipoInput==='2'? TipoAeronave.MILITAR : TipoAeronave.COMERCIAL;

    const a = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
    if(await a.salvar()) console.log(`Aeronave ${codigo} cadastrada!`);
    else console.log(`Já existe uma aeronave com esse código.`);
    mostrarMenuAeronaves();
}

async function cadastrarPeca() {
    if(!checarPermissao("cadastrarPeca")) { console.log("Você não tem permissão."); return; }
    if(!aeronaveSelecionada){ console.log("Nenhuma aeronave selecionada."); return; }

    const nome = await pergunta("Nome da peça: ");
    const tipos = Object.values(TipoPeca);
    tipos.forEach((t,i)=> console.log(`${i+1} - ${t}`));
    const tipoIndex = parseInt(await pergunta("Escolha o tipo: ")) - 1;
    const tipo = tipos[tipoIndex] || TipoPeca.NACIONAL;

    const fornecedor = await pergunta("Fornecedor: ");
    const status = StatusPeca.EM_PRODUCAO;
    const p = new Peca(nome,tipo,fornecedor,status);
    aeronaveSelecionada.addPecas(p);
    await aeronaveSelecionada.editar();
    console.log(`Peça ${nome} cadastrada com sucesso!`);
}

async function cadastrarEtapa() {
    if(!checarPermissao("cadastrarEtapa")) { console.log("Você não tem permissão."); return; }
    if(!aeronaveSelecionada){ console.log("Nenhuma aeronave selecionada."); return; }

    const nome = await pergunta("Nome da etapa: ");
    if(aeronaveSelecionada.etapas.some(e=>e.nome===nome)){ console.log("Etapa já existe."); return; }
    const prazo = await pergunta("Prazo (ex: 2025-10-10): ");
    const etapa = new Etapa(nome,prazo);

    if(checarPermissao("associarFuncionario")){
        const funcionarios = await Funcionario.carregarTodos();
        if(funcionarios.length>0){
            funcionarios.forEach((f,i)=> console.log(`${i+1} - ${f.nome}`));
            const input = await pergunta("Digite números dos funcionários separados por vírgula ou ENTER: ");
            input.split(',').map(i=>parseInt(i.trim())-1).forEach(i=> {
                if(i>=0 && i<funcionarios.length) etapa.associarFuncionario(funcionarios[i]);
            });
        }
    }

    aeronaveSelecionada.addEtapa(etapa);
    await aeronaveSelecionada.editar();
    console.log(`Etapa ${nome} cadastrada com sucesso!`);
}

async function cadastrarTeste() {
    if(!checarPermissao("registrarTeste")) { console.log("Você não tem permissão."); return; }
    if(!aeronaveSelecionada){ console.log("Nenhuma aeronave selecionada."); return; }

    const tipos = Object.values(TipoTeste);
    tipos.forEach((t,i)=> console.log(`${i+1} - ${t}`));
    const tipo = tipos[parseInt(await pergunta("Escolha o tipo: ")) - 1] || TipoTeste.ELETRICO;

    const resultado = (await pergunta(`Resultado:
1 - ${ResultadoTeste.APROVADO}
2 - ${ResultadoTeste.REPROVADO}
CLI> `))==='1'? ResultadoTeste.APROVADO : ResultadoTeste.REPROVADO;

    if(aeronaveSelecionada.testes.some(t=>t.tipo===tipo)){ console.log("Teste já cadastrado."); return; }

    aeronaveSelecionada.addTeste(new Teste(tipo,resultado));
    await aeronaveSelecionada.editar();
    console.log("Teste cadastrado com sucesso!");
}

async function gerarRelatorio() {
    if(!checarPermissao("gerarRelatorio")) { console.log("Você não tem permissão."); return; }
    if(!aeronaveSelecionada){ console.log("Nenhuma aeronave selecionada."); return; }

    const cliente = await pergunta("Nome do cliente: ");
    const dataEntrega = await pergunta("Data de entrega (ex: 2025-10-10): ");
    const arquivo = await Relatorio.gerar(aeronaveSelecionada,cliente,dataEntrega);
    console.log(`Relatório gerado: ${arquivo}`);
}

rl.on('line', async (line) => {
    const input = line.trim();

    switch (menuAtual) {

        case "principal":
            switch(input) {
                case '0':
                    rl.close();
                    break;
                case '1':
                    mostrarMenuFuncionarios();
                    break;
                case '2':
                    mostrarMenuAeronaves();
                    break;
                case '3':
                    console.log(`Usuário atual: ${funcionarioLogado?.nome}`);
                    mostrarMenuPrincipal();
                    break;
                default:
                    console.log("Opção inválida.");
                    mostrarMenuPrincipal();
            }
            break;

        case "funcionarios":
            switch(input) {
                case '0':
                    mostrarMenuPrincipal();
                    break;
                case '1':
                    await cadastrarFuncionario();
                    break;
                case '2':
                    const funcionarios = await listarFuncionarios();
                    if(funcionarios.length > 0){
                        funcionarios.forEach(f => console.log(`- ${f.nome}`));
                    } else {
                        console.log("Nenhum funcionário cadastrado.");
                    }
                    mostrarMenuFuncionarios();
                    break;
                default:
                    console.log("Opção inválida.");
                    mostrarMenuFuncionarios();
            }
            break;

        case "aeronaves":
            switch(input) {
                case '0':
                    mostrarMenuPrincipal();
                    break;
                case '1':
                    await cadastrarAeronave();
                    break;
                case '2':
                    await listarAeronaves();
                    break;
                default:
                    console.log("Opção inválida.");
                    mostrarMenuAeronaves();
            }
            break;

        case "aeronaveSelecionada":
            switch(input) {
                case '0':
                    aeronaveSelecionada = null;
                    mostrarMenuAeronaves();
                    break;
                case '1':
                    await cadastrarPeca();
                    mostrarMenuAeronaveSelecionada();
                    break;
                case '2':
                    console.log("Use opção de alterar status no CLI.");
                    mostrarMenuAeronaveSelecionada();
                    break;
                case '3':
                    await cadastrarEtapa();
                    mostrarMenuAeronaveSelecionada();
                    break;
                case '4':
                    console.log("Use opção de alterar status no CLI.");
                    mostrarMenuAeronaveSelecionada();
                    break;
                case '5':
                    await cadastrarTeste();
                    mostrarMenuAeronaveSelecionada();
                    break;
                case '6':
                    console.log(aeronaveSelecionada?.getDetalhesCompleto);
                    mostrarMenuAeronaveSelecionada();
                    break;
                case '7':
                    await gerarRelatorio();
                    mostrarMenuAeronaveSelecionada();
                    break;
                default:
                    console.log("Opção inválida.");
                    mostrarMenuAeronaveSelecionada();
            }
            break;
    }
});

rl.on('close', () => {
    console.log("Tchau!");
    process.exit(0);
});

async function main(){
    console.log("Bem-vindo! CTRL+C para sair.\n");

    while((await listarFuncionarios()).length===0){
        console.log("Nenhum funcionário cadastrado. Cadastre o primeiro:");
        await cadastrarFuncionario(true);
    }

    funcionarioLogado = await login();
    if(!funcionarioLogado){ console.log("Falha no login."); rl.close(); return; }

    mostrarMenuPrincipal();
}

main();
