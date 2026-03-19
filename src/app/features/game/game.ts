import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { GameSuccessScreen } from '../game-success-screen/game-success-screen';
import { GameSuccessTimer } from '../game-success-timer/game-success-timer';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';

interface GameCard {
  title: string;
  reward: string;
  validity: string;
  status?: string;
  miningCycle?: string;
  buttonText: string;
  background: string;
  enabled: boolean;
  disableType?: 'button' | 'card';
  level?: string;
}

@Component({
  selector: 'app-game',
  imports: [CommonModule, RouterModule, GameSuccessScreen, GameSuccessTimer, TranslatePipe],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements OnInit {
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  isGameEnabled = false;

  cards: GameCard[] = [
    {
      title: 'Tower BNB - Free Trial',
      reward: 'Earn 8 USDT',
      validity: 'CIRCULATION VALIDITY: 1 DAY',
      buttonText: 'Unlock Now',
      background: '/game-card-1.svg',
      enabled: true,
      disableType: 'button',
      level: 'free',
    },
    {
      title: 'Core 1G Tower Computing',
      reward: 'Status: Pending Activation',
      validity: 'CIRCULATION VALIDITY: 120 DAYS',
      status: 'DEP : 60-500 USDT',
      miningCycle: 'Earn: 1.6% per day',
      buttonText: 'Purchase Now',
      background: '/game-card-2.svg',
      enabled: false,
      disableType: 'button',
      level: 'Level1',
    },
    {
      title: 'Core 2G Tower Computing',
      reward: 'Status: Pending Activation',
      validity: 'CIRCULATION VALIDITY: 120 DAYS',
      status: 'DEP : 501-900 USDT',
      miningCycle: 'Earn: 1.9% per day',
      buttonText: 'Purchase Now',
      background: '/game-card-3.svg',
      enabled: false,
      disableType: 'button',
      level: 'Level2',
    },
    {
      title: 'Core 3G Tower Computing',
      reward: 'Status: Pending Activation',
      validity: 'CIRCULATION VALIDITY: 120 DAYS',
      status: 'DEP : 901-1500 USDT',
      miningCycle: 'Earn: 2.3% per day',
      buttonText: 'Purchase Now',
      background: '/game-card-4.svg',
      enabled: false,
      disableType: 'button',
      level: 'Level3',
    },
    {
      title: 'Core 4G Tower Computing',
      reward: 'Status: Pending Activation',
      validity: 'CIRCULATION VALIDITY 120 DAYS',
      status: 'DEP : 1501-3500 USDT',
      miningCycle: 'Earn: 2.3% per day',
      buttonText: 'Purchase Now',
      background: '/game-card-5.svg',
      enabled: false,
      disableType: 'card', // 🔹 disabled (Coming Soon), 
      level: 'Level4',
    },
  ];

  @ViewChild('gameSuccessModel') gameSuccessModel!: GameSuccessScreen;
  @ViewChild('timer') timer!: GameSuccessTimer;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.getGameData(userId);
        this.loadHomeData();
        console.log("this.isGameEnabled", this.isGameEnabled);
      } else {
        //console.error('❌ No userId found in localStorage');
      }
    }
  }

  getGameData(userId: string) {
    const payload = {
      screen: 'game',
      userId: userId,
    };

    //console.log('🚀 Fetching game details:', payload);

    this.authService.avengers(payload).subscribe({
      next: (res) => {
        //console.log('✅ Game API response:', res);

        if (res.statusCode !== 200 || !res.data) {
          //console.warn('⚠️ Invalid game response');
          return;
        }

        const { isFreeTrailSubcraibed, currectLevel, elegibleLevel, activationTime } = res.data;
        this.isGameEnabled = res.data.isGameEnabled;

        localStorage.setItem('activationTime', activationTime ?? null);

        if (this.isGameEnabled == true) {
          this.cards.map((x) => {
            if (x.level == "Level4") {
              x.enabled = res.data.elegibleLevel == "Level4" ? true : false;
              x.disableType = "button"
            }
          })
        }

        this.ngZone.run(() => {
          // -------------- RULE 1 ------------------
          // If Free Trial is subscribed:
          if (isFreeTrailSubcraibed === true) {
            const freeCard = this.cards.find((c) => c.level === 'free');
            if (freeCard) {
              freeCard.enabled = false;
              freeCard.buttonText = 'Activated';
            }
          }

          // -------------- RULE 2 ------------------
          // Based on currentLevel
          if (currectLevel) {
            const currentCard = this.cards.find((c) => c.level === currectLevel);

            if (currentCard) {
              if (currectLevel === 'free' && isFreeTrailSubcraibed) {
                currentCard.enabled = false;
                currentCard.buttonText = 'Activated';
              } else {
                currentCard.enabled = true;
                currentCard.reward = "Status: Core Activated"
                currentCard.buttonText = 'Active Now';
              }
            }
          }


          let finalEligible = elegibleLevel;

          if (this.isGameEnabled == false) {
            if (finalEligible === 'Level4') {
              finalEligible = 'Level3';
            }
          }

          const eligibleCard = this.cards.find((c) => c.level === finalEligible);



          if (eligibleCard) {
            // If currentLevel equals eligibleLevel → DO NOT show Purchase Now
            if (currectLevel === finalEligible) {
              eligibleCard.enabled = true;
              eligibleCard.reward = "Status: Core Activated"
              eligibleCard.buttonText = 'Active Now';
            } else {
              eligibleCard.enabled = true;
              eligibleCard.buttonText = finalEligible == "Level1" ? 'Purchase Now' : 'Update Now';//Update logic
            }
          }

          this.cards.map((x) => {
            if (x.level != 'free') {
              if (x.level == finalEligible) {
                x.enabled = true
              } else {
                x.enabled = false
              }
            }
          })



          // Trigger UI refresh
          this.cdr.detectChanges();
        });
      },

      error: (err) => {
        //console.error('❌ Failed to fetch game data:', err);
      },
    });
  }

  onAction(card: GameCard) {
    if (!card.enabled && card.disableType === 'button') return;
    if (card.disableType === 'card') return;
    //console.log('🔹 Selected card action:', card);
    // const now = Date.now();
    if (card.buttonText === 'Purchase Now' || card.buttonText === 'Update Now') {
      this.purchaseNow(card);
      return;
    }
    if (card.buttonText === 'Active Now') {
      setTimeout(() => {
        const userId = localStorage.getItem('userId');
        let activationTime: any = localStorage.getItem('activationTime');

        if (activationTime && activationTime != null) {
          let currentTime = Date.now();
          // if (this.isCurrentGreaterThanYesterday(currentTime, activationTime)) {
          //   //console.log(currentTime, activationTime)
          //   this.timer.open(Number(activationTime));
          // } else {
          //   this.activateGame(userId!);
          // }
          if (this.is24HoursCompleted(currentTime, Number(activationTime))) {
            this.activateGame(userId!);
          } else {
            this.timer.open(Number(activationTime));
          }
        }
        return;
      }, 0)
    }
    if (card.buttonText === 'Unlock Now') {
      this.purchaseNow(card);
      return;
    }

    // const now = 1763141263280;
    // this.timer.open(now);
    // this.gameSuccessModel.openModal()
  }

  purchaseNow(card: GameCard) {
    const userId = localStorage.getItem('userId');
    let payload = {
      Level: card.level,
      userId: userId,
    };
    this.authService.purchaseNow(payload).subscribe({
      next: (res) => {
        //console.log('✅ Commission API response:', res);

        if (res.statusCode === 200 && res.data) {
          // Run UI updates in Angular zone for correct re-render
          this.ngZone.run(() => {
            if (card.buttonText === 'Unlock Now') {
              this.getGameData(userId!);
              this.cdr.detectChanges();
              this.gameSuccessModel.openModal()
              return;
            } else {
              this.activateGame(userId!);
              this.cdr.detectChanges();
            }
          });
        } else {
          //console.warn('⚠️ ERROR response');
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        //console.error('❌ Failed to fetch commission details:', err);
      },
    });
  }

  activateGame(userId: string) {
    const payload = {
      userId: userId,
    };

    //console.log('🚀 Fetching commission details:', payload);

    this.authService.activateGame(payload).subscribe({
      next: (res) => {
        //console.log('✅ Active Now API response:', res);

        if (res.statusCode === 200 && res.data) {
          // Run UI updates in Angular zone for correct re-render
          this.ngZone.run(() => {
            this.getGameData(userId!);
            this.cdr.detectChanges();
            this.gameSuccessModel.openModal();
          });
        } else {
          //console.warn('⚠️ Active Now data found or invalid response');
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        //console.error('❌ Failed:', err);
      },
    });
  }

  is24HoursCompleted(currentTs: number, ts: number): boolean {
    const diff = currentTs - ts;
    const dayInMs = 24 * 60 * 60 * 1000; // 86400000  
    return diff >= dayInMs;
  }

  onPopupClosed() {
    window.location.reload();
  }

  loadHomeData() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found in localStorage');
      return;
    }

    const payload = {
      screen: 'home',
      userId
    };
    var withdrawalWallet = "0";
    this.authService.avengers(payload).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          withdrawalWallet = res.data.totalEarnings;
          this.cdr.detectChanges();
        });
        localStorage.setItem('earnings', withdrawalWallet);
      },
      error: (err) => {
        console.error('Error fetching home data:', err);
      }
    });
  }

}
