import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';


@Injectable()
export class SincronizadorProvider {
  
  private pathBiblia = "biblias";
  items: Observable<any[]>;
  livros: string = ""; 

  constructor(private afDB: AngularFireDatabase, private storage: Storage) {
    
  }

  async sincronizar(){
    this.afDB.list("biblias").valueChanges().subscribe(item => {      
      this.livros = JSON.stringify(item);      
    });
  }

  
  possuiBibliaNoStorage(): boolean{
    let possuiBiblia: boolean = false;

    this.storage.get("biblia").then(result => {
      possuiBiblia = true;
      console.log("SIM, EU POSSUI A BÍBLIA NO STORAGE: " + this.storage.get("biblia"));
    }).catch(err => {
      possuiBiblia = false;
    });

    return possuiBiblia;
  }

  gravarNoStorage(chave: string, valor: any){
    this.storage.set(chave, valor);
    console.log("gravou: " + chave);
  }
  
}

