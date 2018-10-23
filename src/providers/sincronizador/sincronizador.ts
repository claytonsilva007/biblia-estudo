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
    this.afDB.list("/").valueChanges().subscribe(item => {      
      this.livros = JSON.stringify(item);      
    });
  }
 
}

