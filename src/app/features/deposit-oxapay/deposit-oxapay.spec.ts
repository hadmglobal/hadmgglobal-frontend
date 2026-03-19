import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositOxapay } from './deposit-oxapay';

describe('DepositOxapay', () => {
  let component: DepositOxapay;
  let fixture: ComponentFixture<DepositOxapay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositOxapay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositOxapay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
