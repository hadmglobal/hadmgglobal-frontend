import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commision } from './commision';

describe('Commision', () => {
  let component: Commision;
  let fixture: ComponentFixture<Commision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commision]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commision);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
