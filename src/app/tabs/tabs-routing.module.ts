import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab2/:segmentModel',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'para-voce',
        loadChildren: () => import('../para-voce/para-voce.module').then(m => m.ParaVocePageModule)
      },
      {
        path: 'radios',
        loadChildren: () => import('../radios/radios.module').then(m => m.RadiosPageModule)
      },
      {
        path: 'favoritos',
        loadChildren: () => import('../pages/favoritos/favoritos.module').then(m => m.FavoritosPageModule)
      },
      {
        path: 'mais',
        loadChildren: () => import('../pages/mais/mais.module').then(m => m.MaisPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
