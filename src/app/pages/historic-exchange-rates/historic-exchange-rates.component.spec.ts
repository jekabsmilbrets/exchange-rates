import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricExchangeRatesComponent } from './historic-exchange-rates.component';

describe('HistoricExchangeRatesComponent', () => {
  let component: HistoricExchangeRatesComponent;
  let fixture: ComponentFixture<HistoricExchangeRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                   declarations: [HistoricExchangeRatesComponent],
                 })
                 .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricExchangeRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
