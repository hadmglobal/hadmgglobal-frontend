import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSuccessScreen } from './game-success-screen';

describe('GameSuccessScreen', () => {
  let component: GameSuccessScreen;
  let fixture: ComponentFixture<GameSuccessScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSuccessScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSuccessScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
