import { Versiculo } from "./Biblia";

export class Favoritos {
    
    chave: string;
    data: string;
    cor: string;

    constructor(chave: string, data: string, cor: string){
        this.chave = chave;
        this.data = data;
        this.cor = cor;
    }
}

