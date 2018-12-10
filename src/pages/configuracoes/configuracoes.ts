import { Component } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';

@IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage {

  tamanhoFonte: number;
  frase: string;
  fonteCabecaho: string;
  valorBaseFonteReal: number = 2;
  step: number = 0.25;

  constructor(private bibliaProvider: ConfiguracaoBibliaProvider, public events: Events) {
    this.frase = "Jesus!";
    this.tamanhoFonte = this.bibliaProvider.getBiblia().tamanhoFonte;
    this.fonteCabecaho = this.getTramanhoTransformado(this.tamanhoFonte);
  }

  aumentar() {
    this.tamanhoFonte = this.tamanhoFonte + this.step;
    this.fonteCabecaho = this.getTramanhoTransformado(this.tamanhoFonte);
    this.bibliaProvider.biblia.tamanhoFonte = this.tamanhoFonte;
  }

  diminuir() {
    this.tamanhoFonte = this.tamanhoFonte - this.step;
    this.fonteCabecaho = this.getTramanhoTransformado(this.tamanhoFonte);
    this.bibliaProvider.biblia.tamanhoFonte = this.tamanhoFonte;
  }

  getTramanhoTransformado(tamanhoReal: number): string {
    let qtdeSteps = (this.valorBaseFonteReal - tamanhoReal) / 0.25;
    qtdeSteps = qtdeSteps < 0 ? qtdeSteps * -1 : qtdeSteps;
    let tamanhoFormatado: number;

    if (tamanhoReal >= 2) {
      tamanhoFormatado = this.valorBaseFonteReal + 10 + qtdeSteps;
    } else {
      tamanhoFormatado = this.valorBaseFonteReal + 10 - qtdeSteps;
    }

    return tamanhoFormatado.toString();
  }

  desativarNotificacoes(){
    this.bibliaProvider.biblia.planosDeLeitura.forEach(p => {
      this.events.publish('planoLeitura:desativar-som', p);
    });
  }

  ativarNotificacoes(){
    this.bibliaProvider.biblia.planosDeLeitura.forEach(p => {
      this.events.publish('planoLeitura:ativar-som', p);
    });
  }

  excluirNotificacoes(){
    this.bibliaProvider.biblia.planosDeLeitura.forEach(p => {
      this.events.publish('planoLeitura:cancelarLocalNotification', p);
    });
  }
  
}


