import { Injectable } from '@angular/core';

@Injectable()
export class ConstantesProvider {

  // CONTÉM TODAS AS CHAVES DAS PRINCIPAIS CONSTANTES DO SISTEMA

  public BIBLIA_CHAVE: string = "biblia";
  public CKECK_BIBLIA_STORAGE: string = "1";
  public ULTIMO_LIVRO_LIDO: string = "2";

  constructor() {
    
  }

  getChaveBiblia(){

  }

}
