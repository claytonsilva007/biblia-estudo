export class ComentarioPlanosLeitura{
    idComentario: number;
    idUsuarioComentou: string;
    texto: string;
    data: Date;
    curtidas: number;    

    constructor(){
        this.data = new Date();
    }
}