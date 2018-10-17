export class Biblia {
    nome: string;
    livros: Livro[];

    constructor() {
        this.livros = new Array();
    }
}

export class Livro {
    abreviatura: string;
    capitulos: Capitulo[];
    nome: string;

    constructor() {
        this.capitulos = new Array();
    }
}

export class Capitulo {
    versiculos: Versiculo[];

    constructor() {
        this.versiculos = new Array();
    }
}

export class Versiculo {
    texto: string;
    backgroundColor: string;
    constructor(texto: string) {
        this.texto = texto;
        this.backgroundColor = "#FFFFFF";
    }

    public setCor(corParam: string){
        this.backgroundColor = corParam;
    }
}