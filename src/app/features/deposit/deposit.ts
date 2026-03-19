import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-deposit',
  imports: [CommonModule, MatButtonModule, MatInputModule, MatIconModule, FormsModule, TranslatePipe],
  templateUrl: './deposit.html',
  styleUrl: './deposit.scss',
  standalone: true,
})
export class Deposit implements OnInit {
  isVisible = false;
  isClosing = false;
  amount: number | null = null;
  selectedToken: any = null;
  quickAmounts = [60, 500, 900, 1500];
  compoletedDeposit = false;
  transactionAccounts: any[] = [];
  showRechargeInfo = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  @Output() depositCompleted = new EventEmitter<void>();
  ngOnInit() {
    console.log('Deposit modal initialized');
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) this.loadAvengerAccounts(userId);
    }
  }

  loadAvengerAccounts(userId: string) {
    const payload = { screen: 'deposits', userId };

    this.authService.avengers(payload).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && res.data?.transactionAccounts) {
          this.transactionAccounts = res.data.transactionAccounts;

          // Default to first token
          if (this.transactionAccounts.length > 0) {
            this.selectedToken = this.transactionAccounts[0];
          }

          // 🧠 Trigger UI update manually (zoneless)
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error loading avenger accounts:', err)
    });
  }

  openModal() {
    this.isVisible = true;
    this.isClosing = false;
    document.body.style.overflow = 'hidden';
  }

  animateClose() {
    // 🌀 trigger rotation + slide animation
    if (this.isClosing) return; // prevent double clicks
    this.isClosing = true;

    const icon = document.querySelector('.close-icon');
    icon?.classList.add('rotate-close');

    // Wait for animation to finish before hiding popup
    icon?.classList.remove('rotate-close');
    this.closeModal();
  }

  closeModal() {
    this.isVisible = false;
    this.isClosing = false;
    this.compoletedDeposit = false;
    document.body.style.overflow = 'auto';
  }

  setAmount(value: number) {
    this.amount = value;
  }

  selectToken(token: any) {
    this.selectedToken = token;
  }

  confirmDeposit() {
    if (!this.amount || !this.selectedToken) {
      alert('Please enter amount and select a token.');
      return;
    }

    const userId = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('userId')
      : null;

    if (!userId) {
      alert('User not found');
      return;
    }

    const payload = {
      userId,
      amount: this.amount,
      transactionAccount: this.selectedToken
    };

    this.authService.doPayment(payload).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          // this.compoletedDeposit = true;
          console.log('Deposit confirmed, emitting event...');
          this.depositCompleted.emit();
          let data = res?.data || {};
          data.amount = payload.amount;
          localStorage.setItem("pay", JSON.stringify(res.data));
          // setInterval(() => {
          this.router.navigate(['/payment']);
          // }, 100)
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Deposit failed:', err);
        alert('Deposit failed. Please try again.');
      }
    });
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
    this.isVisible = false;
    this.isClosing = false;
  }

  openRechargeInfo() {
    this.showRechargeInfo = true;
  }

  closeRechargeInfo() {
    this.showRechargeInfo = false;
  }
}
