import { Injectable } from '@angular/core';

@Injectable()
export class ConstantesProvider {

  // CONTÉM TODAS AS CHAVES DAS PRINCIPAIS CONSTANTES DO SISTEMA
  public DIVISOES_BIBLIA: DivisoesBiblia[] = [];
  public BIBLIA_CHAVE: string = "biblia";
  public CKECK_BIBLIA_STORAGE: string = "1";
  public ULTIMO_LIVRO_LIDO: string = "2";
  public CHAVE_PREFERENCIAS_NOTIFICACOES: string = "3";
  public USUARIO_LOGADO: string = "usuarioLogado";
  public CHAVE_FAVORITOS: string = "favoritos";
  
  //VARIÁVEIS RELACIONADAS AO TEXTO
  public CHAVE_TAMANHO_FONTE: string = "tamanho_fonte";
  public COR_TEXTO_SELECIONADO: string = "#C2C7D6";
  public COR_TEXTO_COMENTADO: string = "#EBEFF2";
  public TEXTO_SEM_COR: string = "#FFFFFF";

  
  public PENTATEUCO: string = "Pentateuco";
  public LIVROS_HISTORICOS: string = "Livros Históricos";
  public LIVROS_POETICOS: string = "Livros Poéticos";
  public PROFETAS_MAIORES: string = "Profetas Maiores";
  public PROFATAS_MENORES: string = "Profetas Menores";
  public EVANGELHOS: string = "Evangelhos";
  public LIVRO_HISTORICO_NT: string = "Livro Histórico NT";
  public EPISTOLAS_PAULO: string = "Epístolas do Apóstolo Paulo";
  public EPISTOLAS_OUTROS_AUTORES: string = "Epístolas de Autores Diversos";
  public REVELACOES: string = "Revelações";

  constructor() {    
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(0, 4, "Pentateuco"));
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(5, 16, "Livros Históricos"));
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(17, 21, "Livros Poéticos"));
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(22, 26, "Profetas Maiores"));
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(27, 38, "Profetas Menores"));
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(39, 42, "Evangelhos"));
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(43, 43, "Livro Histórico NT"));
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(44, 56, "Epístolas do Apóstolo Paulo"));
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(57, 64, "Epístolas de Autores Diversos"));
    this.DIVISOES_BIBLIA.push(new DivisoesBiblia(65, 65, "Revelações"));
  }


  getTituloDivider(indexInicio: number): string{
    return this.DIVISOES_BIBLIA.find(element => element.indexInicio === indexInicio).descricao;
  }

  getDivisaoPorDescricao(descricao: string): DivisoesBiblia{
    return this.DIVISOES_BIBLIA.find(element => element.descricao === descricao);
  }

  getTodasDivisoesBiblia(){
    return this.DIVISOES_BIBLIA;
  }

}

export class DivisoesBiblia{
  
  indexInicio: number;
  indexFim: number;
  descricao: string;

  constructor(indexInicio: number, indexFim: number, descricao: string){
    this.indexInicio = indexInicio;
    this.indexFim = indexFim;
    this.descricao = descricao;
  }

}
