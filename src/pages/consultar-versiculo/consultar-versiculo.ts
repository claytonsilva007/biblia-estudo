import { Component, VERSION } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Biblia, Versiculo } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { ConstantesProvider } from '../../providers/constantes/constantes';

@IonicPage()
@Component({
  selector: 'page-consultar-versiculo',
  templateUrl: 'consultar-versiculo.html',
})
export class ConsultarVersiculoPage {

  jsonQuery = require('json-query');

  searchQuery: string = '';
  items: string[];

  amplitudePesquisa: string;
  biblia: Biblia;
  versiculos: Versiculo[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, public constantes: ConstantesProvider) {

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
  
  filtrarComRegex(){
    let regex = new RegExp("^(?=.*Deus)(?=.*céus)(?=.*terra).*$");      
    let versiculos: Versiculo[] = this.bibliaProvider.getBiblia().livros[0].capitulos[0].versiculos;      
    //console.log(versiculos.filter(versiculoLoop => { return versiculoLoop.texto.match(regex) }));

    this.filtarPorMultiplosNiveis();
  }


  filtarPorMultiplosNiveis(){
    let retorno: any[] = [];
    let regex = new RegExp("^(?=.*Deus)(?=.*céus)(?=.*terra).*$"); 

      this.bibliaProvider.getBiblia().livros.filter(function search(row) {        
      return Object.keys(row).some((key) => {        
          
        if(typeof row[key] === "string") {  // estou no último nível do array aninhado 
            
            let x = Object.getOwnPropertyDescriptor(row, "texto");
            let texto: string = (x !== undefined ? x.value: "");

            if(texto.match(regex)){
              retorno.push(row);
              return row;
            }

          } else if(row[key] && typeof row[key] === "object") {             
            return search(row[key]);                                     
          }

        return false;                                                     

      });
    }); 

    console.log(retorno);
  }
}
