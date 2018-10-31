import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable()
export class SincronizadorProvider {
  
  private pathBiblia = "biblias";
  items: Observable<any[]>;
  livros: string = ""; 

  constructor(private afDB: AngularFireDatabase) {
    
  }

  async sincronizar(){
    this.afDB.list("/").valueChanges().subscribe(item => {      
      this.livros = JSON.stringify(item);      
    });
  }
 
}

