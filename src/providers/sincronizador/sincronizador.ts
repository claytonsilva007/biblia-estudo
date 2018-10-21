import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Item } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../configuracao-biblia/configuracao-biblia';

@Injectable()
export class SincronizadorProvider {
  
  private pathBiblia = "biblias";
  items: Observable<any[]>;
  livros: string = ""; 

  constructor(private afDB: AngularFireDatabase) {
    
  }

  async sincronizar(){
    this.afDB.list("biblias").valueChanges().subscribe(item => {      
      this.livros = JSON.stringify(item);      
    });
  }
  
}

