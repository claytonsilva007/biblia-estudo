import { DateTime } from "ionic-angular";

export class Favoritos {
    
    chave: string;
    backgroundColor: string;
    data: Date;

    constructor(chave: string, backgroundColor: string, data: Date){
        this.chave = chave;
        this.backgroundColor = backgroundColor;
        this.data = data;
    }
}

