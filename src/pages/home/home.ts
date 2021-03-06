import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, NavParams, ActionSheetController, Events, Platform } from 'ionic-angular';
import { Versiculo, Biblia } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { ComentariosPage } from '../comentarios/comentarios';

import { ConstantesProvider } from '../../providers/constantes/constantes';
import { ConsultarVersiculoPage } from '../consultar-versiculo/consultar-versiculo';

import { SocialSharing } from '@ionic-native/social-sharing';
import { UtilProvider } from '../../providers/util/util';

import { ToastController } from 'ionic-angular';
import { ModalFontePage } from '../modal-fonte/modal-fonte';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  segmentoSelecionado: string = "livros";
  abaLivroDescricao: string = "Livros"
  abaCapituloDescricao: string = "Capítulos";  
  abaVersiculoDescricao: string = "Versículos";  
  versiculosSelecionados: number[];
  foiSelecionado: boolean = false;
  comentario: string;
  exibirPaletaDeCores: boolean;
  exibirBtnComentar: boolean;
  versiculoParaComentar: versiculoParaComentar;
  podeVisualizarComentarios: boolean;
  exibirBotoesNavegacao: boolean;
  exibirBotaoDeBusca: boolean;
  loading: any;
  VisualizarBtnCriar: boolean;
  ultimoVersiculoSelecionado: Versiculo;
  exibirBtnCompartilhamento: boolean;
  biblia: Biblia;

  fontSize: number;
  exibirComentariosUsuario: boolean;

  actionSheet: any;

  constructor(public navCtrl: NavController, public bibliaProvider: ConfiguracaoBibliaProvider, 
                public modalCtrl: ModalController, public loadingCtrl: LoadingController, 
                public constantes: ConstantesProvider, private socialSharing: SocialSharing, 
                public navParams: NavParams, private utilProvider: UtilProvider,
                private toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, 
                private platform: Platform,public events: Events) {

    this.biblia = bibliaProvider.getBiblia();
    this.versiculoParaComentar = new versiculoParaComentar();
    this.exibirPaletaDeCores = false;
    this.exibirBtnComentar = false;
    this.podeVisualizarComentarios = false;
    this.exibirBotoesNavegacao = true;
    this.exibirBotaoDeBusca = true;
    this.VisualizarBtnCriar = true;
    this.exibirBtnCompartilhamento = false;
    this.fontSize = this.bibliaProvider.biblia.tamanhoFonte;
    this.exibirComentariosUsuario = false;

    if (this.platform.is('android')){
      this.events.subscribe('appComponent:backButtom', () => {
          this.limparTela();
      });
    }
  } 
  
  limparTela(){
    this.getVersiculosSelecionados().forEach(v => v.backgroundColor = this.constantes.TEXTO_SEM_COR);
    this.ocultarBotao();
    this.ocultarBtnCompartilharEComentar();
    this.ocultarBtnCompartilharEComentarClick();
    this.actionSheet.dismiss();
  }

  atualizarSegmentoCapitulos(indexLivro: number){
    this.abaLivroDescricao = this.biblia.livros[indexLivro].nome;
    this.versiculoParaComentar.nomeLivro = this.biblia.livros[indexLivro].nome;
    this.versiculoParaComentar.indexLivro = indexLivro;
    this.segmentoSelecionado = "capitulos";
    this.abaCapituloDescricao = "Capítulos";
    this.abaVersiculoDescricao = "Versículos";
    this.exibirBotaoDeBusca = false;
    this.exibirBtnCompartilhamento = false;
    this.exibirBotoesNavegacao = true;
  }

  atualizarSegmentoVersiculos(indexCapitulo: number){
    this.segmentoSelecionado = "versiculos";
    this.abaCapituloDescricao = "Capítulo ";
    this.abaVersiculoDescricao = (indexCapitulo + 1).toString();
    this.versiculoParaComentar.indexCapitulo = indexCapitulo;
    this.exibirBotaoDeBusca = false;
    this.exibirBtnCompartilhamento = false;
    this.exibirBotoesNavegacao = true;
  }

  selecionarCapitulo(){
    this.segmentoSelecionado = "capitulos"
  }

  /**
   * Método acionado quando um ion-item é pressionado.
   * Altera a cor de fundo.
   */
  pressEvent(e, versiculo: Versiculo, indexVersiculo:number) {
   
    this.versiculoParaComentar.indexVersiculo = indexVersiculo;
    this.exibirBtnComentar = false;
    this.exibirPaletaDeCores = false; 
    this.exibirBtnCompartilhamento = false;
    this.configurarCoresDeSelecao(versiculo);
    this.configurarExibicaoControleNavegacao(versiculo);
    this.ultimoVersiculoSelecionado = versiculo;
  }

  configurarCoresDeSelecao(versiculo: Versiculo){
    if(versiculo.backgroundColor === this.constantes.TEXTO_SEM_COR){
      versiculo.backgroundColor = this.constantes.COR_TEXTO_SELECIONADO;      
      this.configurarExibicaoBotoes(versiculo);
    } else if(versiculo.backgroundColor === this.constantes.COR_TEXTO_SELECIONADO){
      versiculo.backgroundColor = this.constantes.TEXTO_SEM_COR;
      this.configurarExibicaoBotoes(versiculo);
    } else if(versiculo.backgroundColor === this.constantes.COR_TEXTO_COMENTADO){
      this.exibirBtnComentar = true;
      this.VisualizarBtnCriar = false;
      this.podeVisualizarComentarios = true;
    } else if(versiculo.backgroundColor !== this.constantes.COR_TEXTO_SELECIONADO 
                && versiculo.backgroundColor !== this.constantes.COR_TEXTO_COMENTADO 
                && versiculo.backgroundColor !== this.constantes.COR_TEXTO_SELECIONADO){

        this.exibirPaletaDeCores = true;
        this.exibirBtnCompartilhamento = true;
        versiculo.backgroundColor = this.constantes.COR_TEXTO_SELECIONADO;                    
    }

    if(versiculo.backgroundColor === this.constantes.TEXTO_SEM_COR){
      this.bibliaProvider.removerFavorito(versiculo);
    }

  }

  configurarExibicaoBotoes(versiculo: Versiculo){
    let qtdeVersiculosSelecionados = this.getQuantidadeLinhasSelecionadas();

    if(versiculo.backgroundColor === this.constantes.COR_TEXTO_SELECIONADO){
      if(qtdeVersiculosSelecionados === 0){
        this.exibirBtnComentar = false;
        this.exibirPaletaDeCores = false;
        this.exibirBtnCompartilhamento = false;
        this.podeVisualizarComentarios = false;
      } else if(qtdeVersiculosSelecionados === 1){
        this.exibirBtnComentar = true;
        this.exibirPaletaDeCores = true;
        this.exibirBtnCompartilhamento = true;
        this.exibirBtnComentar = true;
        if(versiculo.comentariosUsuario.length > 0){
          this.podeVisualizarComentarios = true;
        }
      } else if(qtdeVersiculosSelecionados > 1){
        this.exibirBtnComentar = false;
        this.exibirPaletaDeCores = true;
        this.exibirBtnCompartilhamento = true;
        this.podeVisualizarComentarios = false;
      }
    } else if(qtdeVersiculosSelecionados === 1){
      this.exibirBtnComentar = true;
        this.exibirPaletaDeCores = true;
      this.exibirBtnCompartilhamento = true;
    }else if(qtdeVersiculosSelecionados > 1) {
      this.exibirBtnComentar = false;
      this.exibirPaletaDeCores = true;
      this.exibirBtnCompartilhamento = true;
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
                      .versiculos.filter(vLoop => vLoop.backgroundColor === this.constantes.COR_TEXTO_SELECIONADO).length;
  }

  getVersiculosSelecionados(): Versiculo[] {
    return this.biblia.livros[this.versiculoParaComentar.indexLivro]
      .capitulos[this.versiculoParaComentar.indexCapitulo]
      .versiculos.filter(vLoop => vLoop.backgroundColor === this.constantes.COR_TEXTO_SELECIONADO);
  }

  setarCor(cor:string){
    let versiculosListAux: Versiculo[] = [];

    this.biblia.livros[this.versiculoParaComentar.indexLivro].capitulos[this.versiculoParaComentar.indexCapitulo].versiculos
      .filter(versiculoLoop => versiculoLoop.backgroundColor === this.constantes.COR_TEXTO_SELECIONADO)
            .forEach(versiculoLoop => {
              versiculoLoop.backgroundColor = cor;
              versiculosListAux.push(versiculoLoop);
            });

    this.bibliaProvider.favoritarVersiculos(versiculosListAux);
    this.exibirPaletaDeCores = false;
    this.exibirBtnComentar = false;
    this.exibirBtnCompartilhamento = false;

  }
 
  navegarParaComentarios(){ 
    this.exibirBtnComentar = false;
    this.exibirPaletaDeCores = false;
    this.exibirBtnCompartilhamento = false;
    
    let modalComentarios = this.modalCtrl.create(ComentariosPage, {versiculo: this.ultimoVersiculoSelecionado});

      modalComentarios.present();
      modalComentarios.onDidDismiss(data => { 
        
          if(data.comentario !== "" && data.comentario !== undefined && data.comentario !== null){
            
            this.biblia.livros[this.versiculoParaComentar.indexLivro]
                  .capitulos[this.versiculoParaComentar.indexCapitulo]
                  .versiculos[this.versiculoParaComentar.indexVersiculo]
                  .comentariosUsuario[0] = data.comentario;

            this.biblia.livros[this.versiculoParaComentar.indexLivro]
                  .capitulos[this.versiculoParaComentar.indexCapitulo]
                  .versiculos[this.versiculoParaComentar.indexVersiculo]
                  .backgroundColor = "#EBEFF2";
            
            this.presentToast("Comentário adicionado com sucesso!");      
                  
        } else {
          this.biblia.livros[this.versiculoParaComentar.indexLivro]
          .capitulos[this.versiculoParaComentar.indexCapitulo]
          .versiculos[this.versiculoParaComentar.indexVersiculo]
          .backgroundColor = "#FFFFFF";
        } 
      });    
    }
    
    podeVisualizarComentariosExistentes(){
      if(this.biblia.livros[this.versiculoParaComentar.indexLivro]
                    .capitulos[this.versiculoParaComentar.indexCapitulo]
                    .versiculos[this.versiculoParaComentar.indexVersiculo]
                    .backgroundColor === this.constantes.COR_TEXTO_COMENTADO){

                      if (this.biblia.livros[this.versiculoParaComentar.indexLivro]
                                      .capitulos[this.versiculoParaComentar.indexCapitulo]
                                      .versiculos[this.versiculoParaComentar.indexVersiculo]
                                      .comentariosUsuario.length > 0 ){
                        return true; 
                      }      
      }
      return false;
    }
    
  excluirComentario(){
    if(this.ultimoVersiculoSelecionado.comentariosUsuario.length > 0){
      this.ultimoVersiculoSelecionado.backgroundColor = this.constantes.COR_TEXTO_SELECIONADO;
      this.ultimoVersiculoSelecionado.comentariosUsuario.splice(0, 1);
      this.exibirBtnComentar = false;
      this.presentToast("Comentário excluído com sucesso!");
    }
  }

  verificaSeExistemComentariosRetornoModal(qtdeComentarios: number, versiculo: Versiculo){
    if(qtdeComentarios == 0 ){
      versiculo.backgroundColor = this.constantes.COR_TEXTO_SELECIONADO;
      this.exibirBtnComentar = false;
    }
  }

  /**
   * retorna a quantidade de versículos comentados no capítulo selecionado.
   */
  verificaExistenciaComentariosCapitulo(): number{
    
    let retorno: number = 0;

    if(this.versiculoParaComentar.indexCapitulo !== undefined 
        && this.versiculoParaComentar.indexLivro !== undefined 
        && this.versiculoParaComentar.indexVersiculo !== undefined){
      retorno = this.biblia.livros[this.versiculoParaComentar.indexLivro]
        .capitulos[this.versiculoParaComentar.indexCapitulo]
        .versiculos.filter(v => v.comentariosUsuario.length > 0).length;
    }

    return retorno;
                
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

  swipeEvent(e) {
    if(e.direction == 2){
      this.navegarParaFrente();
    } else if(e.direction == 4){
      this.navegarParaTras();
    }
  }

  atualizarDadosNavegacao(){
    this.abaLivroDescricao = this.biblia.livros[this.versiculoParaComentar.indexLivro].nome;
    this.abaCapituloDescricao = "Capítulo " ;
    this.segmentoSelecionado = "versiculos";
    this.abaVersiculoDescricao = (this.versiculoParaComentar.indexCapitulo+1).toString();
    this.exibirBotaoDeBusca = false; 
  }

  navegarParaTelaBusca(){
    this.navCtrl.push(ConsultarVersiculoPage);
  }

  ocultarBotao(){
    this.exibirBtnComentar = false;
  }


  ocultarBotaoBusca(){
    this.exibirBotaoDeBusca = false;
  }

  // SEMPRE QUE O USUÁRIO ESTIVER EM UM SEGMENTO DIFERENTE DE VERSÍCULOS, OS BOTÕES ABAIXO DEVEM SER OCULTADOS.
  ocultarBtnCompartilharEComentarClick(){
    if(this.segmentoSelecionado === "livros" || this.segmentoSelecionado === "capitulos"){
      this.exibirBtnCompartilhamento = false;
      this.exibirBtnComentar = false;      
      this.getVersiculosSelecionados().forEach(v => {v.backgroundColor = this.constantes.COR_TEXTO_SELECIONADO});
      this.exibirPaletaDeCores = false;
      this.exibirBotoesNavegacao = true;
    }
  }
  
  ocultarBtnCompartilharEComentar(){
      this.exibirBtnCompartilhamento = false;
      this.exibirBtnComentar = false;      
      this.getVersiculosSelecionados().forEach(v => {v.backgroundColor = this.constantes.COR_TEXTO_SELECIONADO});
      this.exibirPaletaDeCores = false;
      this.exibirBotoesNavegacao = true;
  }

  exibirBtnBusca(){
    this.exibirBotaoDeBusca = true;
  }

  podeVisualizarBtnCriar(): boolean{
    
    if (this.getVersiculosSelecionados().length == 0){
      return true;  
    }
    return false;
  }

  configBtnComentarios(){
    if(this.exibirBtnComentar){
      this.exibirBtnComentar = false;
    } else{
      this.exibirBtnComentar = true;
    }
  }

  configBtnCompartilhamentos(){
    if (this.exibirBtnCompartilhamento){
      this.exibirBtnCompartilhamento = false;
    } else {
      this.exibirBtnCompartilhamento = true;
    }
  }

  /** compartilhamento dos versículos selecionados */
  compartilharVersiculo(){
    this.regularShare();
    this.showLoading();
    this.getVersiculosSelecionados().forEach(v => {v.backgroundColor = this.constantes.TEXTO_SEM_COR});
  }

  compartilharPorFacebook(){
    this.socialSharing.shareViaFacebook(this.getTextoFormatadoParaCompartilhar(), "", "");
    this.ocultarBtnCompartilharEComentar();
  }

  compartilharPorWhatsApp(){
    this.socialSharing.shareViaWhatsApp(this.getTextoFormatadoParaCompartilhar(), "", "");
    this.ocultarBtnCompartilharEComentar();
  }

  compartilharPorTwitter(){
    this.socialSharing.shareViaTwitter(this.getTextoFormatadoParaCompartilhar(), "", "");
    this.ocultarBtnCompartilharEComentar();
  }

  regularShare() {    
    this.socialSharing.share(this.getTextoFormatadoParaCompartilhar(), null, null, null).then( () => {
      this.hideLoading();
    }).catch(err => {
      this.hideLoading();
    });
    this.ocultarBtnCompartilharEComentar();
  }

  getTextoFormatadoParaCompartilhar(): string{
    let vs = this.getVersiculosSelecionados();
    let strRef: string = "";
    vs.length === 1 ? strRef = this.bibliaProvider.getDescricaoCompletaVersiculo(vs[0]) : strRef = this.bibliaProvider.getDescricaoCompletaVersiculo(vs[0]).concat("-", (vs[vs.length-1].codigoVersiculo+1).toString());
    
    let texto = "";
    vs.forEach(versiculo => {
      texto = texto.concat(versiculo.texto);
    });

    texto = texto.concat(" \n\n", strRef, " - Bíblia de Estudo");
    
    return texto;
  }

  configurarFonte(){
    let modalFonte = this.modalCtrl.create(ModalFontePage);
    modalFonte.present();
  }

  private showLoading() {
    let min = Math.ceil(0);
    let max = Math.floor(this.utilProvider.versiculos.length);
    let indexDaSorte: number = Math.floor(Math.random() * (max - min + 1)) + min;
    let versiculoDaSorte = this.utilProvider.versiculos[indexDaSorte];

    this.loading = this.loadingCtrl.create({
      content: versiculoDaSorte
    });

    this.loading.present();
  }

  private hideLoading() {
    this.loading.dismiss();
  }

  presentToast(mensagem: string) {
    let toast = this.toastCtrl.create({
      message: mensagem,
      duration: 5000,
      position: 'botom'
    });

    toast.onDidDismiss(() => {
     
    });

    toast.present();
  }


  presentActionSheet() {    
    this.ocultarBotao();
    this.ocultarBtnCompartilharEComentar();
    this.ocultarBtnCompartilharEComentarClick();

    let buttons: any[] = [];
    let textoBtnComentarios = "";
    
    if(this.exibirComentariosUsuario === true){
      textoBtnComentarios = "Ocultar seus comentários";
    } else {
      textoBtnComentarios = "Visualizar seus comentários";
    }

    if(this.verificaExistenciaComentariosCapitulo() > 0){
      buttons.push(
        {
          text: textoBtnComentarios,
          role: '',
          handler: () => {
            if(this.exibirComentariosUsuario === false){
              this.exibirComentariosUsuario = true;  
            } else {
              this.exibirComentariosUsuario = false;
            }
          }
        });
      }

    buttons.push({
      text: 'Ajustar tamanho da fonte',
      handler: () => {
        this.configurarFonte();
        this.fontSize = this.bibliaProvider.biblia.tamanhoFonte;
      }
    }); 

    buttons.push({
      text: 'Solicitar Comentário',
      handler: () => {
        if (this.getQuantidadeLinhasSelecionadas() === 0){
          this.presentToast("Voce precisa selecionar um ou mais versículos.");
        }
      }
    });      

    buttons.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => { 
        this.getVersiculosSelecionados().forEach(v => {
          v.backgroundColor = this.constantes.TEXTO_SEM_COR;
        });
      }
    });

    if(this.exibirComentariosUsuario === true){
      textoBtnComentarios = "Ocultar seus comentários";
    }

    this.actionSheet = this.actionSheetCtrl.create(
      {
        title: 'Opções de Leitura',
        buttons
      }
    );

    this.actionSheet.present();
  }

  ionViewDidLoad(){
    if (this.navParams.get("versiculoParam") !== null && this.navParams.get("versiculoParam") !== undefined){
      let versiculo: Versiculo = this.navParams.get("versiculoParam");
      this.atualizarSegmentoCapitulos(versiculo.codigoLivro);
      this.atualizarSegmentoVersiculos(versiculo.codigoCapitulo);
      this.bibliaProvider.biblia.livros[versiculo.codigoLivro].capitulos[versiculo.codigoCapitulo].versiculos[versiculo.codigoVersiculo].backgroundColor = this.constantes.COR_TEXTO_SELECIONADO;
      this.segmentoSelecionado = "versiculos";
    }

  }

  setarTextoPadrao(){
    if(this.versiculoParaComentar.indexLivro === undefined){
      this.atualizarSegmentoCapitulos(0);
      this.atualizarSegmentoVersiculos(0);
    }
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
