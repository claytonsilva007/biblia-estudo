import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';

@IonicPage()
@Component({
  selector: 'page-modal-fonte',
  templateUrl: 'modal-fonte.html',
})
export class ModalFontePage {

  tamanhoFonte: number;
  fonteCabecaho: string;
  frase: string;
  step: number = 0.25;
  valorBaseFonteReal: number = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private viewController: ViewController, private bibliaProvider: ConfiguracaoBibliaProvider) {

    this.tamanhoFonte = this.bibliaProvider.getBiblia().tamanhoFonte;
    this.fonteCabecaho = this.getTramanhoTransformado(this.tamanhoFonte);
    
    this.frase = "Jesus!";
  }
  

  aumentar(){
    this.tamanhoFonte = this.tamanhoFonte + this.step;
    this.fonteCabecaho = this.getTramanhoTransformado(this.tamanhoFonte);
  }

  diminuir(){
    this.tamanhoFonte = this.tamanhoFonte - this.step;
    this.fonteCabecaho = this.getTramanhoTransformado(this.tamanhoFonte);
  }

  restaurarValorPadrao(){
    this.tamanhoFonte = 2;
    this.fonteCabecaho = this.getTramanhoTransformado(this.tamanhoFonte);
  }

  getTramanhoTransformado(tamanhoReal: number): string{
    let qtdeSteps = (this.valorBaseFonteReal - tamanhoReal) / 0.25;
    qtdeSteps = qtdeSteps < 0 ? qtdeSteps *-1 : qtdeSteps;
    let tamanhoFormatado: number;
    
    if(tamanhoReal >= 2){
      tamanhoFormatado = this.valorBaseFonteReal + 10 + qtdeSteps;  
    } else {
      tamanhoFormatado = this.valorBaseFonteReal + 10 - qtdeSteps;  
    }
    
    return tamanhoFormatado.toString();
  }

  salvar(){
    this.bibliaProvider.biblia.tamanhoFonte = this.tamanhoFonte;
    this.viewController.dismiss();
  }
  
  closeModal() {
    this.viewController.dismiss();
  }

}
