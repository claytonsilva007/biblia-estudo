import { PlanoLeitura } from "./PlanosLeitura";

export class Biblia {
    nome: string;
    livros: Livro[];
    tamanhoFonte: number = 2;
    planosDeLeitura: PlanoLeitura[];

    constructor() {
        this.livros = [];
        this.planosDeLeitura = [];
    }
}

export class Livro {
    codigoLivro: number;
    abreviatura: string;
    capitulos: Capitulo[];
    nome: string;
    resumo: string;

    constructor() {
        this.capitulos = new Array();
    }
}

export class Capitulo {
    
    codigoLivro: number;
    codigoCapitulo: number;
    
    versiculos: Versiculo[];

    constructor() {
        this.versiculos = new Array();
    }
}

export class Versiculo {
    codigoLivro: number;
    codigoCapitulo: number;
    codigoVersiculo: number;
    texto: string;
    backgroundColor: string;
    comentariosUsuario: string[];
    comentariosWeb: string[];
    
    constructor() {
        this.backgroundColor = "#FFFFFF";
        this.comentariosUsuario = new Array();
        this.comentariosWeb = new Array();
    }

    public setCor(corParam: string){
        this.backgroundColor = corParam;
    }

    public adicionarComentario(comentarioParam: string){
        if(comentarioParam !== ""){
            this.comentariosUsuario.push(comentarioParam);
            this.backgroundColor = "#EBEFF2";
        } else if(this.comentariosUsuario.length == 0){
            this.backgroundColor = "#FFFFFF";
        }
    }
}