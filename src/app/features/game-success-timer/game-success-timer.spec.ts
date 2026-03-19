import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSuccessTimer } from './game-success-timer';

describe('GameSuccessTimer', () => {
  let component: GameSuccessTimer;
  let fixture: ComponentFixture<GameSuccessTimer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSuccessTimer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSuccessTimer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
