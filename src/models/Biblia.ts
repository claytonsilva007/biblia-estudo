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
    comentarios: string[];

    constructor(texto: string) {
        this.texto = texto;
        this.backgroundColor = "#FFFFFF";
        this.comentarios = new Array();
    }

    public setCor(corParam: string){
        this.backgroundColor = corParam;
    }

    public adicionarComentario(comentarioParam: string){
        if(comentarioParam !== ""){
            this.comentarios.push(comentarioParam);
            this.backgroundColor = "#EBEFF2";
        } else if(this.comentarios.length == 0){
            this.backgroundColor = "#FFFFFF";
        }
    }
}