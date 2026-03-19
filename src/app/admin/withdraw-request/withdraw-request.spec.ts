import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawRequest } from './withdraw-request';

describe('WithdrawRequest', () => {
  let component: WithdrawRequest;
  let fixture: ComponentFixture<WithdrawRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
