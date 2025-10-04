import { ResultadoTeste, TipoTeste } from "../enums";

export class Teste{
    public tipo: TipoTeste
    public resultado: ResultadoTeste

    constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
        this.tipo = tipo
        this.resultado = resultado
    }
}