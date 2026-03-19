import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeposits } from './user-deposits';

describe('UserDeposits', () => {
  let component: UserDeposits;
  let fixture: ComponentFixture<UserDeposits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeposits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeposits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
