import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maintainance } from './maintainance';

describe('Maintainance', () => {
  let component: Maintainance;
  let fixture: ComponentFixture<Maintainance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maintainance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Maintainance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
