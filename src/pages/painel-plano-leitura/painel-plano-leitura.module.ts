import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PainelPlanoLeituraPage } from './painel-plano-leitura';

@NgModule({
  declarations: [
    PainelPlanoLeituraPage,
  ],
  imports: [
    IonicPageModule.forChild(PainelPlanoLeituraPage),
  ],
})
export class PainelPlanoLeituraPageModule {}
