import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component'),
    children: [
      {
        path: 'chatbots',
        loadComponent: () => import('./bunisess/chatbots/chatbots.component').then(m => m.ChatbotsComponent),
      },      
      {
        path: '',
        redirectTo: 'layout',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'chatbots'
  },
];
