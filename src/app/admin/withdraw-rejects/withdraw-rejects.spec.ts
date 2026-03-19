import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawRejects } from './withdraw-rejects';

describe('WithdrawRejects', () => {
  let component: WithdrawRejects;
  let fixture: ComponentFixture<WithdrawRejects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawRejects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawRejects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
