import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalhePlanoLeituraPage } from './detalhe-plano-leitura';

@NgModule({
  declarations: [
    DetalhePlanoLeituraPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalhePlanoLeituraPage),
  ],
})
export class DetalhePlanoLeituraPageModule {}
