import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Devocional } from '../../models/Devocional';

@IonicPage()
@Component({
  selector: 'page-devocional-diaria',
  templateUrl: 'devocional-diaria.html',
})
export class DevocionalDiariaPage {

  devocionais: Devocional[];
  devocionalDoDia: Devocional;
  dataAtual: string;
  data: Date;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.devocionais = this.povoarDevocionais();
    this.getDevocionalDoDia();
    this.dataAtual = this.dataAtualFormatada();
  }

  getDevocionalDoDia(){
    this.devocionalDoDia = this.devocionais[0];    
  }

  povoarDevocionais(): Devocional[]{
    let devocionais: Devocional[] = [];
    devocionais.push(new Devocional("Adoração a Deus", "E far-te-ei uma grande nação, e abençoar-te-ei e engrandecerei o teu nome; e tu serás uma bênção. E abençoarei os que te abençoarem, e amaldiçoarei os que te amaldiçoarem; e em ti serão benditas todas as famílias da terra.", "Gênesis 12.2-3"));
    return devocionais;
  }

  dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }
  
}
