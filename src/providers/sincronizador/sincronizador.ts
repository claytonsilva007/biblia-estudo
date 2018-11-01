import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class SincronizadorProvider {
  
  livros: string = ""; 

  constructor(private afDB: AngularFireDatabase) {
    
  }

  async sincronizar(){
    this.afDB.list("/").valueChanges().subscribe(item => {      
      this.livros = JSON.stringify(item);      
    });
  }
 
}

