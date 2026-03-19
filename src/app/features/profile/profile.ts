import {
  Component,
  ViewChild,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Deposit } from '../deposit/deposit';
import { Transfer } from '../transfer/transfer';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, MatIconModule, Deposit, Transfer, TranslatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  @ViewChild('depositModal') depositModal!: Deposit;
  @ViewChild('transferModal') transferModal!: Transfer;


  showSupport = false;
  showLogout = false;
  amount = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  user = {
    name: 'Admin',
    email: 'admin@gmail.com',
    workingWallet: 0,
    withdrawalWallet: 0,
  };
  telegramLinkTwo: string = ''
  telegramLinkThree: string = ''
  walletActions = [
    { icon: '/deposit.svg', label: 'Deposit' },
    { icon: '/withdrawal.svg', label: 'Withdrawal' },
    { icon: '/history.svg', label: 'History' },
    { icon: '/group.svg', label: 'Group' }
  ];

  walletSummary = [
    { label: "Today's Personal commission", value: 0 },
    { label: 'Team daily commission', value: 0 },
    { label: 'Grand Total commission', value: 0 },
    { label: 'Your Flexible Deposit', value: 0 },
    { label: 'Your Total withdrawals', value: 0 }
  ];

  settings = [
    { label: 'Change password' },
    { label: 'Terms and conditions' },
    { label: 'Help & support' }
  ];
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.getProfileData(userId);
      } else {
        console.error('❌ No userId found in localStorage');
      }
    }
  }
  // ----------------------------------------------------------------------
  // 🔥 PROFILE API CALL (Avengers API)
  // ----------------------------------------------------------------------
  getProfileData(userId: string) {
    const payload = {
      screen: 'profile',
      userId: userId,
    };

    console.log('📌 Calling Avengers Profile API:', payload);

    this.authService.avengers(payload).subscribe({
      next: (res) => {
        console.log('✅ Profile API Response:', res);

        if (res.statusCode !== 200 || !res.data) {
          console.warn('⚠️ No profile data received');
          return;
        }

        const data = res.data;

        this.ngZone.run(() => {
          // Update user wallets
          this.user.name = data.name || 'User';
          this.user.email = data.email || 'Email';
          this.user.workingWallet = Number(data.totalDeposits ?? 0);
          this.user.withdrawalWallet = Number(data.totalEarnings ?? 0);
          this.telegramLinkTwo = data.telegramLinkTwo;
          this.telegramLinkThree = data.telegramLinkThree;
          // Update Summary dynamically
          this.walletSummary = [
            { label: "Today's Personal commission", value: Number(data.usersTodaysCommission ?? 0) },
            { label: 'Team daily commission', value: Number(data.teamDailyCommission ?? 0) },
            { label: 'Grand Total commission', value: Number(data.grandTotalCommission ?? 0) },
            { label: 'Your Flexible Deposit', value: Number(data.flexibleDeposite ?? 0) },
            { label: 'Your Total withdrawals', value: Number(data.totalWithdrawals ?? 0) }
          ];

          this.cdr.detectChanges();
        });
      },

      error: (err) => {
        console.error('❌ Failed to fetch profile data:', err);
      }
    });
  }


  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2).toUpperCase();
  }

  onWalletAction(label: string) {
    if (label === 'Deposit') {
      this.depositModal.openModal();
    } else if (label === 'Withdrawal') {
      this.router.navigate(['/withdraw']);
    } else if (label === 'History') {
      this.router.navigate(['/history']);
    } else if (label === 'Group') {
      this.opentelegramLinkTwo();
    } else if (label == 'Transfer') {
      this.transferModal.openModal();
    }
  }


  opentelegramLinkTwo() {
    if (this.telegramLinkTwo) {
      window.open(this.telegramLinkTwo, '_blank');
    }
  }
  openSupportPopup() {
    this.showSupport = true;
  }

  closeSupportPopup() {
    this.showSupport = false;
  }

  onSupport() {
    console.log("SUPPORT");
    if (this.telegramLinkThree) {
      window.open(this.telegramLinkThree, '_blank');
    }
  }

  onSetting(label: string) {
    console.log('Clicked setting:', label);
    if (label == 'Terms and conditions') {
      this.router.navigate(['/t&c']);
    } else if (label == 'Help & support') {
      this.openSupportPopup();
    } else if (label == 'Change password') {
      localStorage.setItem("email", this.user.email)
      this.router.navigate(['/change-password']);
    }
  }

  logout() {
    this.showLogout = true;
  }

  confirmLogout() {
    console.log('Logged out');
    localStorage.removeItem('userId');
    this.router.navigate(['/signin']);
  }

  closeLogout() {
    this.showLogout = false
  }

  onTransferClosed() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.getProfileData(userId);
      } else {
        console.error('❌ No userId found in localStorage');
      }
    }
  }


}
