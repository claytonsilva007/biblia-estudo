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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.devocionais = this.povoarDevocionais();
    this.getDevocionalDoDia();
  }

  getDevocionalDoDia(){
    this.devocionalDoDia = this.devocionais[0];    
  }

  povoarDevocionais(): Devocional[]{
    let devocionais: Devocional[] = [];
    devocionais.push(new Devocional("Adoração a Deus", "E far-te-ei uma grande nação, e abençoar-te-ei e engrandecerei o teu nome; e tu serás uma bênção. E abençoarei os que te abençoarem, e amaldiçoarei os que te amaldiçoarem; e em ti serão benditas todas as famílias da terra.", "Gênesis 12.2-3"));
    return devocionais;
  }
  
}
