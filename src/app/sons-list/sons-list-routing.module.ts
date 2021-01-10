import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SonsListPage } from './sons-list.page';

const routes: Routes = [
  {
    path: '',
    component: SonsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SonsListPageRoutingModule {}
