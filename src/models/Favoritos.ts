import { Versiculo } from "./Biblia";

export class Favoritos {
    
    chave: string;
    data: string;

    constructor(chave: string, data: string){
        this.chave = chave;
        this.data = data;
    }
}

