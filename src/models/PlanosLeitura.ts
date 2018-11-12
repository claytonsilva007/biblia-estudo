import { ComentarioPlanosLeitura } from '../models/ComentarioPlanosLeitura';
 
export class PlanoLeitura{
    autor: string;
    titulo: string;
    subTitulo: string;
    descricao: string;
    compartilhamentos: number;
    likes: number;
    comentarios: ComentarioPlanosLeitura[];
    diasDeLeitura: number;
    ativo: boolean;
    unidadesLeituraDiaria: UnidadesLeituraDiaria[];

    constructor(){
        this.comentarios = [];
        this.unidadesLeituraDiaria = [];
        this.ativo = false;
    }
}

export class UnidadesLeituraDiaria{
    
    dataParaLeitura: Date;
    statusLeituraSegmentos: boolean;
    tituloLeituraDiaria: string;
    segmentosLeituraDiaria: SegmentoLeituraDiaria[];

    constructor(){
        this.segmentosLeituraDiaria = [];
        this.statusLeituraSegmentos = false;
        this.dataParaLeitura = new Date();
    }
}

export class SegmentoLeituraDiaria{
    
    segmentoLeitura: string;
    statusLeitura: boolean;

    constructor(){
        this.statusLeitura = false;
    }
}