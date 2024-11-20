import { SaleComponent } from './bunisess/sale/sale.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './bunisess/dashboard/dashboard.component';
import { ProductComponent } from './bunisess/product/product.component';
import { ClientComponent } from './bunisess/client/client.component';
import { ChatBotsComponent } from './bunisess/chatBots/chatBots.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'products',
        component: ProductComponent
      },
      {
        path: 'client',
        component: ClientComponent
      },
      {
        path: 'sale',
        component: SaleComponent
      },
      {
        path: 'chatBots',
        component: ChatBotsComponent
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
