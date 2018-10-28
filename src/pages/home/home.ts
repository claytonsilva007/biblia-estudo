import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { Livro, Capitulo, Versiculo, Biblia } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { ComentariosPage } from '../comentarios/comentarios';
import { ModalTodosComentariosPage } from '../modal-todos-comentarios/modal-todos-comentarios';

import { ConstantesProvider } from '../../providers/constantes/constantes';
import { ConsultarVersiculoPage } from '../consultar-versiculo/consultar-versiculo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  corLinhaSelecionada: string = "#C2C7D6";
  corLinhaComentada: string = "#EBEFF2";
  linhaSemCor: string = "#FFFFFF"; 

  segmentoSelecionado: string = "livros";
  abaLivroDescricao: string = "Livros"
  abaCapituloDescricao: string = "Capítulos";  
  versiculosSelecionados: number[];
  foiSelecionado: boolean = false;
  comentario: string;
  exibirPaletaDeCores: boolean;
  exibirBtnComentar: boolean;
  versiculoParaComentar: versiculoParaComentar;
  podeVisualizarComentarios: boolean;
  exibirBotoesNavegacao: boolean;
  exibirBotaoDeBusca: boolean;

  biblia: Biblia;

  constructor(public navCtrl: NavController, public bibliaProvider: ConfiguracaoBibliaProvider, 
                public modalCtrl: ModalController, public loadingCtrl: LoadingController, public constantes: ConstantesProvider) {

    this.biblia = bibliaProvider.getBiblia();
    this.versiculoParaComentar = new versiculoParaComentar();
    this.exibirPaletaDeCores = false;
    this.exibirBtnComentar = false;
    this.podeVisualizarComentarios = false;
    this.exibirBotoesNavegacao = true;
    this.exibirBotaoDeBusca = true;
  } 

  atualizarSegmentoCapitulos(indexLivro: number){
    this.abaLivroDescricao = this.biblia.livros[indexLivro].nome;
    this.versiculoParaComentar.nomeLivro = this.biblia.livros[indexLivro].nome;
    this.versiculoParaComentar.indexLivro = indexLivro;
    this.segmentoSelecionado = "capitulos";
    this.abaCapituloDescricao = "Capítulos";
    this.exibirBotaoDeBusca = false;
  }

  atualizarSegmentoVersiculos(indexCapitulo: number){
    this.segmentoSelecionado = "versiculos";
    this.abaCapituloDescricao = "Capítulo: " + (indexCapitulo+1);
    this.versiculoParaComentar.indexCapitulo = indexCapitulo;
    this.exibirBotaoDeBusca = false;
  }

  /**
   * Método acionado quando um ion-item é pressionado.
   * Altera a cor de fundo.
   */
  pressEvent(e, versiculo: Versiculo, indexVersiculo:number) {
   
    this.versiculoParaComentar.indexVersiculo = indexVersiculo;
    this.exibirBtnComentar = false;
    this.exibirPaletaDeCores = false;   
    this.configurarCoresDeSelecao(versiculo);
    this.configurarExibicaoControleNavegacao(versiculo);
  }

  configurarCoresDeSelecao(versiculo: Versiculo){
    if(versiculo.backgroundColor === this.linhaSemCor){
      versiculo.backgroundColor = this.corLinhaSelecionada;      
      this.configurarExibicaoBotoes(versiculo);
    } else if(versiculo.backgroundColor === this.corLinhaSelecionada){
      versiculo.backgroundColor = this.linhaSemCor;
      this.configurarExibicaoBotoes(versiculo);
    } else if(versiculo.backgroundColor === this.corLinhaComentada){
      this.exibirBtnComentar = true;
      this.podeVisualizarComentarios = true;
    } else if(versiculo.backgroundColor !== this.linhaSemCor 
                && versiculo.backgroundColor !== this.corLinhaComentada 
                && versiculo.backgroundColor !== this.corLinhaSelecionada){

        this.exibirPaletaDeCores = true;
        versiculo.backgroundColor = this.corLinhaSelecionada;          
                  
    }
  }

  configurarExibicaoBotoes(versiculo: Versiculo){
    let qtdeVersiculosSelecionados = this.getQuantidadeLinhasSelecionadas();

    if(versiculo.backgroundColor === this.corLinhaSelecionada){
      if(qtdeVersiculosSelecionados === 0){
        this.exibirBtnComentar = false;
        this.exibirPaletaDeCores = false;
        this.podeVisualizarComentarios = false;
      } else if(qtdeVersiculosSelecionados === 1){
        this.exibirBtnComentar = true;
        this.exibirPaletaDeCores = true;
        if(versiculo.comentariosUsuario.length > 0){
          this.podeVisualizarComentarios = true;
        }
      } else if(qtdeVersiculosSelecionados > 1){
        this.exibirBtnComentar = false;
        this.exibirPaletaDeCores = true;
        this.podeVisualizarComentarios = false;
      }
    } else if(qtdeVersiculosSelecionados === 1){
      this.exibirBtnComentar = true;
        this.exibirPaletaDeCores = true;
    }else if(qtdeVersiculosSelecionados > 1) {
      this.exibirBtnComentar = false;
      this.exibirPaletaDeCores = true;
    } 
  }

  configurarExibicaoControleNavegacao(versiculo: Versiculo){
    if(this.getQuantidadeLinhasSelecionadas() > 0){
      this.exibirBotoesNavegacao = false;
    } else {
      this.exibirBotoesNavegacao = true;
    }    
  }

  getQuantidadeLinhasSelecionadas(): number{
    return this.biblia.livros[this.versiculoParaComentar.indexLivro]
                      .capitulos[this.versiculoParaComentar.indexCapitulo]
                      .versiculos.filter(vLoop => vLoop.backgroundColor === this.corLinhaSelecionada).length;
  }

  setarCor(cor:string){
    this.biblia.livros[this.versiculoParaComentar.indexLivro].capitulos[this.versiculoParaComentar.indexCapitulo].versiculos
      .filter(versiculoLoop => versiculoLoop.backgroundColor === this.corLinhaSelecionada)
            .forEach(versiculoLoop => {
              versiculoLoop.backgroundColor = cor; 
            });

    this.exibirPaletaDeCores = false;
    this.exibirBtnComentar = false;

  }
 
  navegarParaComentarios(){ 
    this.exibirBtnComentar = false;
    this.exibirPaletaDeCores = false;

    let modalComentarios = this.modalCtrl.create(ComentariosPage, { 
                            "qtdeComentarios": this.biblia.livros[this.versiculoParaComentar.indexLivro]
                                                          .capitulos[this.versiculoParaComentar.indexCapitulo]
                                                          .versiculos[this.versiculoParaComentar.indexVersiculo]
                                                          .comentariosUsuario.length,  
                            "indexLivro": this.versiculoParaComentar.indexLivro,
                            "nomeLivro": this.versiculoParaComentar.nomeLivro, 
                            "numCapitulo": this.versiculoParaComentar.indexCapitulo+1, 
                            "numVersiculo": this.versiculoParaComentar.indexVersiculo +1});

      modalComentarios.present();
      modalComentarios.onDidDismiss(data => { 
        
          if(data.comentario !== "" && data.comentario !== undefined && data.comentario !== null){
            
            this.biblia.livros[this.versiculoParaComentar.indexLivro]
                  .capitulos[this.versiculoParaComentar.indexCapitulo]
                  .versiculos[this.versiculoParaComentar.indexVersiculo]
                  .comentariosUsuario.push(data.comentario);

            this.biblia.livros[this.versiculoParaComentar.indexLivro]
                  .capitulos[this.versiculoParaComentar.indexCapitulo]
                  .versiculos[this.versiculoParaComentar.indexVersiculo]
                  .backgroundColor = "#EBEFF2";
                  
                  this.bibliaProvider.salvarBiblia(this.biblia);
        } else {
          this.biblia.livros[this.versiculoParaComentar.indexLivro]
          .capitulos[this.versiculoParaComentar.indexCapitulo]
          .versiculos[this.versiculoParaComentar.indexVersiculo]
          .backgroundColor = "#FFFFFF";
        } 
      });    
    }

    ocultarBotao(){
      this.exibirBtnComentar = false;
    }

    podeVisualizarComentariosExistentes(){
      if(this.biblia.livros[this.versiculoParaComentar.indexLivro]
                    .capitulos[this.versiculoParaComentar.indexCapitulo]
                    .versiculos[this.versiculoParaComentar.indexVersiculo]
                    .backgroundColor === this.corLinhaComentada){

                      if (this.biblia.livros[this.versiculoParaComentar.indexLivro]
                                      .capitulos[this.versiculoParaComentar.indexCapitulo]
                                      .versiculos[this.versiculoParaComentar.indexVersiculo]
                                      .comentariosUsuario.length > 0 ){
                        return true; 
                      }      
      }
      return false;
    }

    exibirTodosComentarios(){
      let livro: Livro = this.bibliaProvider.getBiblia().livros[this.versiculoParaComentar.indexLivro];
      let capitulo: Capitulo = livro.capitulos[this.versiculoParaComentar.indexCapitulo];
      let versiculo: Versiculo = capitulo.versiculos[this.versiculoParaComentar.indexVersiculo];
      
      let tituloParam = "Comentários: " + this.biblia.livros[this.versiculoParaComentar.indexLivro].nome + " " + (this.versiculoParaComentar.indexCapitulo+1) + "." + (this.versiculoParaComentar.indexVersiculo+1);
      let modalTodosComentarios = this.modalCtrl.create(ModalTodosComentariosPage, { "comentariosParam": versiculo.comentariosUsuario, "titulo": tituloParam });
      modalTodosComentarios.present();

      modalTodosComentarios.onDidDismiss(data => {this.verificaSeExistemComentarios(data.qtdeComentarios, versiculo )});

  }

  verificaSeExistemComentarios(qtdeComentarios: number, versiculo: Versiculo){
    if(qtdeComentarios == 0 ){
      versiculo.backgroundColor = this.linhaSemCor;
      this.exibirBtnComentar = false;
    }
  }

  navegarParaTras(){
    try{
      if(this.versiculoParaComentar.indexCapitulo > 0){
        this.biblia.livros[this.versiculoParaComentar.indexLivro].capitulos[this.versiculoParaComentar.indexCapitulo--];
        this.atualizarDadosNavegacao();
      } else if(this.versiculoParaComentar.indexLivro > 0){
        this.versiculoParaComentar.indexLivro--;
        this.versiculoParaComentar.indexCapitulo = this.biblia.livros[this.versiculoParaComentar.indexLivro].capitulos.length - 1;
        this.versiculoParaComentar.indexVersiculo = 0;
        this.atualizarDadosNavegacao();
      }      
        
    } catch(e){
      this.versiculoParaComentar.indexLivro = 0;
      this.versiculoParaComentar.indexCapitulo = 0;
      this.versiculoParaComentar.indexVersiculo = 0;
      this.atualizarDadosNavegacao();
    }    
  }

  navegarParaFrente(){

    try{
      if( (this.versiculoParaComentar.indexCapitulo +1) < this.biblia.livros[this.versiculoParaComentar.indexLivro].capitulos.length){
        this.biblia.livros[this.versiculoParaComentar.indexLivro].capitulos[this.versiculoParaComentar.indexCapitulo++];
        this.atualizarDadosNavegacao();
      } else if( (this.versiculoParaComentar.indexCapitulo+1) === this.biblia.livros[this.versiculoParaComentar.indexLivro].capitulos.length){
        if(this.versiculoParaComentar.indexLivro+1 < this.biblia.livros.length){
          this.versiculoParaComentar.indexLivro++;
          this.versiculoParaComentar.indexCapitulo = 0;
          this.versiculoParaComentar.indexVersiculo = 0;
          this.biblia.livros[this.versiculoParaComentar.indexLivro].capitulos[this.versiculoParaComentar.indexCapitulo];
        }
        
        this.atualizarDadosNavegacao();
      } 

    } catch(e){
      this.versiculoParaComentar.indexLivro = 0;
      this.versiculoParaComentar.indexCapitulo = 0;
      this.versiculoParaComentar.indexVersiculo = 0;
      this.atualizarDadosNavegacao();
    }
  }

  atualizarDadosNavegacao(){
    this.abaLivroDescricao = this.biblia.livros[this.versiculoParaComentar.indexLivro].nome;
    this.abaCapituloDescricao = "Capítulo: " + (this.versiculoParaComentar.indexCapitulo+1);
    this.segmentoSelecionado = "versiculos"; 
  }

  navegarParaTelaBusca(){
    this.navCtrl.push(ConsultarVersiculoPage);
  }

  ocultarBotaoBusca(){
    this.exibirBotaoDeBusca = true;
  }
}

export class versiculoParaComentar{
  
  indexLivro: number;
  nomeLivro: string;
  indexCapitulo: number;
  indexVersiculo: number;

  constructor(){

  }

}
