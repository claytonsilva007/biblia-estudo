import { ComentarioPlanosLeitura } from '../models/ComentarioPlanosLeitura';
 
export class PlanoLeitura{
    titulo: string;
    subTitulo: string;
    descricao: string;
    likes: number;
    compartilhamentos: number;
    comentarios: ComentarioPlanosLeitura[];
    autor: string;

    constructor(){
        this.comentarios = [];
    }
}