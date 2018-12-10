import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Versiculo } from '../../models/Biblia';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { HomePage } from '../home/home';
import { QueryProvider } from '../../providers/consulta-versiculo/query';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';

@IonicPage()
@Component({
  selector: 'page-consultar-versiculo',
  templateUrl: 'consultar-versiculo.html',
})
export class ConsultarVersiculoPage {

  searchQuery: string = '';
  items: string[];
  retorno: Versiculo[] = [];

  constructor(public navCtrl: NavController, public bibliaProvider: ConfiguracaoBibliaProvider, public constantes: ConstantesProvider, private queryProvider: QueryProvider) {

  }

  ionViewDidLoad() {    
    this.retorno = this.queryProvider.filtarPorMultiplosNiveis(["Jesus", "Chorou"]);
  }

  getItems(ev: any) {
    
    if (ev.cancelable || ' ' !== ev.target.value){
      this.retorno = [];
    }
    
    const val: string = ev.target.value;

    if (val && val.trim() != '' && val.length > 4) {
      this.retorno = this.queryProvider.filtarPorMultiplosNiveis(this.prepararArrayPalavrasDeBusca(val));
    } 
  }

  prepararArrayPalavrasDeBusca(chaveDeBusca: string): string[]{
    chaveDeBusca = chaveDeBusca.replace(/( )+/g, ' ');
    let listaDePalavras: string[] = chaveDeBusca.split(" ");
    return listaDePalavras;
  }  

  navegarParaLivro(versiculo: Versiculo){
    versiculo.backgroundColor = this.constantes.COR_TEXTO_SELECIONADO;
    this.navCtrl.push(HomePage, {versiculoParam: versiculo});
  }

}
