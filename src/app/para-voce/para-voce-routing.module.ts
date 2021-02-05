import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParaVocePage } from './para-voce.page';

const routes: Routes = [
  {
    path: '',
    component: ParaVocePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParaVocePageRoutingModule {}
