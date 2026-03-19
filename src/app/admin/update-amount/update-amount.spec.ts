import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAmount } from './update-amount';

describe('UpdateAmount', () => {
  let component: UpdateAmount;
  let fixture: ComponentFixture<UpdateAmount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAmount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAmount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
