import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-deposit-oxapay',
  imports: [CommonModule, RouterModule, TopNav, TranslatePipe],
  templateUrl: './deposit-oxapay.html',
  styleUrl: './deposit-oxapay.scss'
})
export class DepositOxapay implements OnInit {

  data: any = null;

  countdownSeconds = 180;
  countdownText = '';
  intervalRef: any;

  showCopyChip = true;

  pollingRef: any;
  pollingStarted = false; // 🔵 NEW


  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const payData = JSON.parse(localStorage.getItem('pay') || '{}');
    this.data = payData;
    if (this.data?.qr_code) {
      this.data.qr_code = this.data.qr_code.replace(/@56/g, "");
    }

    this.startTimerFromBackend();
  }

  startTimerFromBackend() {
    const backendTime = this.data.date * 1000;
    const now = Date.now();
    const elapsed = Math.floor((now - backendTime) / 1000);

    this.countdownSeconds = 180 - elapsed;
    if (this.countdownSeconds < 0) this.countdownSeconds = 0;

    this.updateCountdownText();

    this.ngZone.runOutsideAngular(() => {
      this.intervalRef = setInterval(() => {
        this.ngZone.run(() => {

          if (this.countdownSeconds > 0) {
            this.countdownSeconds--;
            this.updateCountdownText();

            // 🔵 Start polling EXACTLY after 2 minutes (when 60 sec left)
            if (this.countdownSeconds === 60 && !this.pollingStarted) {
              this.pollingStarted = true;
              this.startPaymentPolling();
            }

            this.cdr.detectChanges();
          }

          else {
            // stop main timer
            clearInterval(this.intervalRef);

            // stop polling also
            this.stopPaymentPolling();

            this.countdownText = 'Checking deposit status…';
            this.cdr.detectChanges();
          }

        });
      }, 1000);
    });
  }

  updateCountdownText() {
    const min = Math.floor(this.countdownSeconds / 60);
    const sec = this.countdownSeconds % 60;
    this.countdownText = `Please wait for ${min} min ${sec
      .toString()
      .padStart(2, '0')} sec Do not go back, refresh, or close this page.`;
  }

  // --------------------------------------------------------------
  // 🔥 POLLING LOGIC (every 10 sec after 2 minutes)
  // --------------------------------------------------------------

  startPaymentPolling() {
    const trackId = this.data.track_id;
    if (!trackId) return;

    // Call immediately once
    this.callPaymentStatus(trackId);

    // Then every 10 seconds
    this.pollingRef = setInterval(() => {
      this.callPaymentStatus(trackId);
    }, 10000);
  }

  stopPaymentPolling() {
    if (this.pollingRef) {
      clearInterval(this.pollingRef);
      this.pollingRef = null;
    }
  }

  callPaymentStatus(trackId: string) {
    const payload = { track_id: trackId };

    this.authService.paymentStatus(payload).subscribe({
      next: (res) => {
        console.log('Payment Status:', res);

        if (res?.status && res?.status == 'paid') {
          this.stopPaymentPolling();
          clearInterval(this.intervalRef);

          this.countdownText = 'Payment received successfully!';
          this.cdr.detectChanges();

          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Payment check failed:', err);
      }
    });
  }

  // --------------------------------------------------------------
  // EXISTING FUNCTIONS (unchanged)
  // --------------------------------------------------------------

  goBack() {
    this.router.navigate(['/home']);
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  copy(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
  }

  getMaskedAddress(addr: string): string {
    if (!addr) return '';
    if (addr.length <= 10) return addr;
    return addr.substring(0, 10) + '...' + addr.substring(addr.length - 10);
  }

  copyToClipboard(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => this.showCopyChip = true)
      .catch(() => alert('Copy failed'));

    setTimeout(() => this.showCopyChip = false, 2000);
  }

  ngOnDestroy() {
    if (this.intervalRef) clearInterval(this.intervalRef);
    this.stopPaymentPolling();
  }

}