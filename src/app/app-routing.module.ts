import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeRatesComponent } from './pages/exchange-rates/exchange-rates.component';
import { HistoricExchangeRatesComponent } from './pages/historic-exchange-rates/historic-exchange-rates.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'exchange-rates',
    pathMatch: 'full',
  },
  {
    path: 'exchange-rates',
    component: ExchangeRatesComponent,
    data: {
      name: 'Rates',
    },
  },
  {
    path: 'historic-exchange-rates',
    component: HistoricExchangeRatesComponent,
    data: {
      name: 'Historic Rates',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
