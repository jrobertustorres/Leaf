import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule} from "@ngx-translate/core";
import { IonicModule } from '@ionic/angular';
import { BreathPageRoutingModule } from './breath-routing.module';

import { BreathPage } from './breath.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BreathPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [BreathPage]
})
export class BreathPageModule {}
