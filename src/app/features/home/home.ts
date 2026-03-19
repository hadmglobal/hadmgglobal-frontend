import { Component, OnInit, OnDestroy, ViewChild, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Deposit } from '../deposit/deposit';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectorRef } from '@angular/core';

import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, Deposit, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authService: AuthService,
    private clipboard: Clipboard,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  @ViewChild('depositModal') depositModal!: Deposit;

  transformStyle = 'translateX(0%)';


  // --- Carousel images: included sample of your uploaded file for testing ---
  carouselImages = [
    '/corosule1.svg',
    '/corosule2.svg',
    '/corosule3.svg',
    '/corosule4.svg',
    '/corosule5.svg',
    '/corosule6.svg',
  ];

  walletActions = [
    { icon: '/deposit.svg', label: 'Deposit' },
    { icon: '/withdrawal.svg', label: 'Withdrawal' },
    { icon: '/history.svg', label: 'History' },
    { icon: '/group.svg', label: 'Group' }
  ];

  currentIndex = 0;
  intervalId: any;
  showSupport = false;

  // Swipe helpers
  private touchStartX = 0;
  private touchCurrentX = 0;
  private isSwiping = false;
  private swipeThreshold = 50; // px to consider as swipe

  // fade helper for smooth transition
  isFading = false;
  fadeTimeout: any;

  workingWallet: string = '0';
  withdrawalWallet: string = '0';
  referralLink: string = '';
  telegramLinkOne: string = '';
  telegramLinkTwo: string = ''
  refferalCode: string = '';

  get currentImage() {
    return this.carouselImages[this.currentIndex];
  }

  ngOnInit() {
    // 🧹 IMPORTANT: reset modal state
    if (this.depositModal) {
      this.depositModal.isVisible = false;
      this.depositModal.isClosing = false;
      document.body.style.overflow = 'auto';
    }

    this.startCarousel();

    if (isPlatformBrowser(this.platformId)) {
      const userId = this.safeGetLocalStorage('userId');
      if (userId) this.loadHomeData();
    }
  }


  onDepositCompleted() {
    console.log('✅ Deposit completed — refreshing home data immediately');
    this.loadHomeData();
    this.cdr.detectChanges(); // ensures immediate UI update in zoneless mode
  }

  loadHomeData() {
    const userId = this.safeGetLocalStorage('userId');
    if (!userId) {
      console.error('No userId found in localStorage');
      return;
    }

    const payload = {
      screen: 'home',
      userId
    };

    this.authService.avengers(payload).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.workingWallet = res.data.totalDeposits;
          this.withdrawalWallet = res.data.totalEarnings;
          this.referralLink = res.data.refferalLink;
          this.telegramLinkOne = res.data.telegramLinkOne;
          this.telegramLinkTwo = res.data.telegramLinkTwo;
          this.refferalCode = res.data.refferalCode;
          this.cdr.detectChanges();
        });
        localStorage.setItem('earnings', this.withdrawalWallet);
      },
      error: (err) => {
        console.error('Error fetching home data:', err);
      }
    });
  }

  copyReferralLink() {
    if (this.referralLink) {
      this.clipboard.copy(this.referralLink);
      alert('Referral link copied!');
    }
  }

  opentelegramLinkOne() {
    if (this.telegramLinkOne) {
      window.open(this.telegramLinkOne, '_blank');
    }
  }
  opentelegramLinkTwo() {
    if (this.telegramLinkTwo) {
      window.open(this.telegramLinkTwo, '_blank');
    }
  }

  onWalletAction(label: string) {
    if (label === 'Deposit') {
      this.depositModal.openModal();
    } else if (label === 'Withdrawal') {
      this.router.navigate(['/withdraw']);
    } else if (label === 'History') {
      this.router.navigate(['/history']);
    } else if (label === 'Group') {
      this.opentelegramLinkOne();
    }
  }

  openSupportPopup() {
    this.showSupport = true;
  }

  closeSupportPopup() {
    this.showSupport = false;
  }

  // ---------- CAROUSEL ----------

  startCarousel() {
    this.clearCarousel();

    // run inside Angular zone and ensure change detection applied
    this.intervalId = setInterval(() => {
      // use ngZone.run to ensure UI updates reliably
      this.ngZone.run(() => {
        this.nextSlide();
      });
    }, 8000); // set to 3000 ms for smoother testing; change to 5000 if needed
  }

  clearCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // public method for dot click
  setCurrentSlide(index: number) {
    if (index === this.currentIndex) {
      // restart timer
      this.restartCarousel();
      return;
    }

    this.changeSlide(index);
    this.restartCarousel();
  }

  private changeSlide(index: number) {
    this.currentIndex = index;
    this.transformStyle = `translateX(-${index * 100}%)`;
    this.cdr.detectChanges();
  }

  private nextSlide() {
    const next = (this.currentIndex + 1) % this.carouselImages.length;
    this.changeSlide(next);
  }

  private prevSlide() {
    const prev = (this.currentIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
    this.changeSlide(prev);
  }

  private restartCarousel() {
    this.clearCarousel();
    this.startCarousel();
  }

  // Image load handler to end fade (optional)
  onImageLoad() {
    // keep short delay then remove fade flag
    if (this.fadeTimeout) clearTimeout(this.fadeTimeout);
    this.fadeTimeout = setTimeout(() => {
      this.isFading = false;
      this.cdr.detectChanges();
    }, 250);
  }

  private triggerFade() {
    this.isFading = true;
    this.cdr.detectChanges();
  }

  // ---------- SWIPE HANDLERS ----------
  onTouchStart(evt: TouchEvent) {
    if (!evt.touches || evt.touches.length === 0) return;
    this.isSwiping = true;
    this.touchStartX = evt.touches[0].clientX;
    this.touchCurrentX = this.touchStartX;
    // pause auto play while swiping
    this.clearCarousel();
  }

  onTouchMove(evt: TouchEvent) {
    if (!this.isSwiping || !evt.touches || evt.touches.length === 0) return;
    this.touchCurrentX = evt.touches[0].clientX;
  }

  onTouchEnd() {
    if (!this.isSwiping) return;
    const deltaX = this.touchCurrentX - this.touchStartX;
    this.isSwiping = false;

    if (Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX < 0) {
        // left swipe: next
        this.nextSlide();
      } else {
        // right swipe: prev
        this.prevSlide();
      }
    } // else treat as tap/no-swipe; do nothing

    // resume autoplay
    this.restartCarousel();
  }

  // ---------- life cycle ----------
  ngOnDestroy() {
    this.clearCarousel();
  }

  // ---------- helpers ----------
  private safeGetLocalStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return null;
  }
}
