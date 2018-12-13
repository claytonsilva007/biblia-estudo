import { DateTime } from "ionic-angular";

export class Favoritos {
    
    chave: string;
    backgroundColor: string;
    data: string;

    constructor(chave: string, backgroundColor: string, data: string){
        this.chave = chave;
        this.backgroundColor = backgroundColor;
        this.data = data;
    }
}

