import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Biblia, Versiculo } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';

@IonicPage()
@Component({
  selector: 'page-consultar-versiculo',
  templateUrl: 'consultar-versiculo.html',
})
export class ConsultarVersiculoPage {

  searchQuery: string = '';
  items: string[];

  amplitudePesquisa: string;
  biblia: Biblia;
  versiculos: Versiculo[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider) {

  }

  initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota'    
    ];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  consultarNaBibliaToda(){
    
    let resultado = this.bibliaProvider.getBiblia().livros.forEach(livro => {
        livro.capitulos.forEach(capitulo => {
          capitulo.versiculos.filter(versiculo => {
            versiculo.texto.search("");
          });
        });
      });
      console.log(resultado);
  }

}
