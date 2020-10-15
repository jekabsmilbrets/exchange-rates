import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-historic-exchange-rates',
  templateUrl: './historic-exchange-rates.component.html',
  styleUrls: ['./historic-exchange-rates.component.scss'],
})
export class HistoricExchangeRatesComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {


    // let params: HistoryRequestParams = {
    //   start_at: '2018-01-01',
    //   end_at: '2018-01-05',
    // };
    //
    // this.api.history(params)
    //     .subscribe(
    //         value => console.log('this.api.history() ', value),
    //     );
  }

}
