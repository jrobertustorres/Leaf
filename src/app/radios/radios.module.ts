import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule} from "@ngx-translate/core";
import { IonicModule } from '@ionic/angular';

import { RadiosPageRoutingModule } from './radios-routing.module';

import { RadiosPage } from './radios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RadiosPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [RadiosPage]
})
export class RadiosPageModule {}
