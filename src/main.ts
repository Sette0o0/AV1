import readline from "readline";
import { Aeronave } from "./classes/Aeronave";
import { Funcionario } from "./classes/Funcionario";
import { TipoAeronave, NivelPermissao } from "./enums";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'CLI> '
});
