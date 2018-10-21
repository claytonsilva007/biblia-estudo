import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { Livro, Capitulo, Versiculo, Biblia } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { ComentariosPage } from '../comentarios/comentarios';
import { ModalTodosComentariosPage } from '../modal-todos-comentarios/modal-todos-comentarios';

import { AngularFireDatabase } from '@angular/fire/database';


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
  livroSelecionado: Livro = null;
  capituloSelecionado: Capitulo = null;
  currentSelected: number;
  versiculosSelecionados: number[];
  foiSelecionado: boolean = false;
  comentario: string;
  exibirPaletaDeCores: boolean;
  exibirBtnComentar: boolean;
  versiculoParaComentar: versiculoParaComentar;
  loading: any;

  biblia: Biblia = null;
  livros: Livro[];

  constructor(private afDB: AngularFireDatabase, public navCtrl: NavController, public bibliaProvider: ConfiguracaoBibliaProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
    this.exibirPaletaDeCores = false;
    this.exibirBtnComentar = false;
    this.versiculoParaComentar = new versiculoParaComentar();
  } 

  atualizarSegmentoCapitulos(livroParam: Livro, indexLivro: number){
    this.livroSelecionado = livroParam;
    this.abaLivroDescricao = this.livroSelecionado.nome;
    this.segmentoSelecionado = "capitulos";
    this.abaCapituloDescricao = "Capítulos";
    this.versiculoParaComentar.indexLivro = indexLivro;
    this.versiculoParaComentar.nomeLivro = this.livroSelecionado.nome;
  }

  atualizarSegmentoVersiculos(indexCapitulo: number){
    this.capituloSelecionado = this.livroSelecionado.capitulos[indexCapitulo];
    this.segmentoSelecionado = "versiculos";
    this.abaCapituloDescricao = "Capítulo: " + (indexCapitulo+1);
    this.versiculoParaComentar.indexCapitulo = indexCapitulo;
  }

  /**
   * Método acionado quando um ion-item é pressionado.
   * Altera a cor de fundo.
   */
  pressEvent(e, versiculo: Versiculo, indexVersiculo:number) {
   
    this.versiculoParaComentar.indexVersiculo = indexVersiculo;
    this.exibirBtnComentar = true;

    if (versiculo.backgroundColor === this.linhaSemCor){ 
      versiculo.backgroundColor = this.corLinhaSelecionada; 
    } else if (versiculo.backgroundColor === this.corLinhaSelecionada){
      versiculo.backgroundColor = this.linhaSemCor;
      this.exibirBtnComentar = false;
    } else if(versiculo.backgroundColor === this.corLinhaComentada) {
      versiculo.backgroundColor = this.corLinhaComentada;
      this.exibirBtnComentar = true;
    } else {
      versiculo.backgroundColor = this.linhaSemCor;
      this.exibirBtnComentar = false;
    }

    this.configurarTela();       
  }

  configurarTela(){
    this.exibirPaletaDeCores = false;   
    
    let qtdeSelecionados = this.getQuantidadeLinhasSelecionadas();

    if(qtdeSelecionados === 1){
      this.exibirPaletaDeCores = true;
      this.exibirBtnComentar = true;
    } else if(qtdeSelecionados > 1){
      this.exibirPaletaDeCores = true;
    }
  }

  getQuantidadeLinhasSelecionadas(): number{
    return this.capituloSelecionado.versiculos.filter(vLoop => vLoop.backgroundColor === this.corLinhaSelecionada).length;
  }

  setarCor(cor:string){
    this.capituloSelecionado.versiculos
      .filter(versiculoLoop => versiculoLoop.backgroundColor === this.corLinhaSelecionada)
            .forEach(versiculoLoop => versiculoLoop.setCor(cor));

    this.exibirPaletaDeCores = false;
    this.exibirBtnComentar = false;

  }
 
  navegarParaComentarios(){ 
    this.exibirBtnComentar = false;
    this.exibirPaletaDeCores = false;

    let modalComentarios = this.modalCtrl.create(ComentariosPage, { 
                          "qtdeComentarios": this.capituloSelecionado.versiculos[this.versiculoParaComentar.indexVersiculo].comentarios.length,  
                          "indexLivro": this.versiculoParaComentar.indexLivro,
                          "nomeLivro": this.versiculoParaComentar.nomeLivro, 
                          "numCapitulo": this.versiculoParaComentar.indexCapitulo+1, 
                          "numVersiculo": this.versiculoParaComentar.indexVersiculo +1});

    modalComentarios.present();
    modalComentarios.onDidDismiss(data => { this.capituloSelecionado.versiculos[this.versiculoParaComentar.indexVersiculo].adicionarComentario(data.comentario)});   
  }

  ocultarBotao(){
    this.exibirBtnComentar = false;
  }

  podeVisualizarComentariosExistentes(){
    if(this.capituloSelecionado.versiculos[this.versiculoParaComentar.indexVersiculo].backgroundColor === this.corLinhaComentada){
      if (this.capituloSelecionado.versiculos[this.versiculoParaComentar.indexVersiculo].comentarios.length > 0 ){
        return true; 
      }      
    }
    return false;
  }

  exibirTodosComentarios(){
    let livro: Livro = this.bibliaProvider.getBiblia().livros[this.versiculoParaComentar.indexLivro];
    let capitulo: Capitulo = livro.capitulos[this.versiculoParaComentar.indexCapitulo];
    let versiculo: Versiculo = capitulo.versiculos[this.versiculoParaComentar.indexVersiculo];
    
    let tituloParam = "Comentários: " + this.livroSelecionado.nome + " " + (this.versiculoParaComentar.indexCapitulo+1) + "." + (this.versiculoParaComentar.indexVersiculo+1);
    let modalTodosComentarios = this.modalCtrl.create(ModalTodosComentariosPage, { "comentariosParam": versiculo.comentarios, "titulo": tituloParam });
    modalTodosComentarios.present();

    modalTodosComentarios.onDidDismiss(data => {this.verificaSeExistemComentarios(data.qtdeComentarios, versiculo )});

  }

  verificaSeExistemComentarios(qtdeComentarios: number, versiculo: Versiculo){
    if(qtdeComentarios == 0 ){
      versiculo.backgroundColor = this.linhaSemCor;
      this.exibirBtnComentar = false;
    }
  }

 //****************************************************************************************88 */
 
 /* Este trecho de código é utilizado para controlar a exibição da tela inicial, a qual contém toda a bíblia e 
    demais informações a ela associadas. Como as requisções são assíncronas, foi necessário controlar o carregamento da tela.

    Os dados assíncronos são requisitados dentro de um modal. Quando a tela inicial é requisitada (ionViewDidLoad(), onPageWillEnter()), 
    O método de criação do modal é chamado (showLoading()). Dentro deste método ocorre a chamada do ao método assíncrono.
    O pulo do gato é só fechar o modal acessar playload e executar o tratamento dos dados JSON do texto bíblico.
    
 */ 
  ionViewDidLoad() {
    this.showLoading();
  }
 
 onPageWillEnter() {
   this.showLoading();    
  }

  /** Modal que  */
  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
       
    this.loading.present();
   
    this.getAsyncData();
  }

  private getAsyncData() {
    this.livros = new Array();
    
    let x: any;

    this.afDB.list("biblias").snapshotChanges().subscribe(item => 
      {           
        item.forEach(livro => {
          item.map(obj => { 
            this.bibliaProvider.configurarBiblia(JSON.stringify(obj.payload.val())); 
          });
        }); 

        this.hideLoading();

      });
  }

  private hideLoading() {    
    this.loading.dismiss();
  }

  

//****************************************************************************************88 */

}

export class versiculoParaComentar{
  
  indexLivro: number;
  nomeLivro: string;
  indexCapitulo: number;
  indexVersiculo: number;

  constructor(){

  }

}
