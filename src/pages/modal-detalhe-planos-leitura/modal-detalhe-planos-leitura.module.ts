import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalDetalhePlanosLeituraPage } from './modal-detalhe-planos-leitura';

@NgModule({
  declarations: [
    ModalDetalhePlanosLeituraPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDetalhePlanosLeituraPage),
  ],
})
export class ModalDetalhePlanosLeituraPageModule {}
