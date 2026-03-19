import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawAccepts } from './withdraw-accepts';

describe('WithdrawAccepts', () => {
  let component: WithdrawAccepts;
  let fixture: ComponentFixture<WithdrawAccepts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawAccepts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawAccepts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
