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

import { Transfer } from '../transfer/transfer';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';

// import { TopNav } from '../top-nav/top-nav';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, MatIconModule, TranslatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('transferModal') transferModal!: Transfer;


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
    avatar: '/avatar1.svg' // default placeholder
  };
  telegramLinkTwo: string = ''
  telegramLinkThree: string = ''

  walletSummary = [
    { label: "Recharge Amount", value: 0 },
    { label: 'Earnings Balance', value: 0 },
    { label: 'Total Earnings', value: 0 },
    { label: "Today's Task Earnings", value: 0 },
    { label: "Today's Team Income", value: 0 },
    { label: "Total Valid Team Count", value: 0 },
    { label: "Total Withdrawal", value: 0 },
    { label: "Total Balance", value: 0 },
    { label: "Total Revenue", value: 0 },
  ];

  settings = [
    { label: 'Change password', icon: '/change-password.svg' },
    { label: 'Terms and conditions', icon: '/termsandc.svg' },
    { label: 'Set Transaction Password', icon: '/transpass.svg' },
    { label: 'Transaction History', icon: '/transh.svg' },
    { label: 'Help & support', icon: '/h&su.svg' }
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
          this.user.avatar = data.avatar || localStorage.getItem('avatarUrl') || '/avatar1.svg';
          this.telegramLinkTwo = data.telegramLinkTwo;
          this.telegramLinkThree = data.telegramLinkThree;

          // Using dummy values of 3.66 for now as placeholders for the 9-item grid mapping as requested
          this.walletSummary = [
            { label: "Recharge Amount", value: 3.66 },
            { label: "Earnings Balance", value: 3.66 },
            { label: "Total Earnings", value: 3.66 },
            { label: "Today's Task Earnings", value: 3.66 },
            { label: "Today's Team Income", value: 3.66 },
            { label: "Total Valid Team Count", value: 3.66 },
            { label: "Total Withdrawal", value: 3.66 },
            { label: "Total Balance", value: 3.66 },
            { label: "Total Revenue", value: 3.66 },
          ];

          this.cdr.detectChanges();
        });
      },

      error: (err) => {
        console.error('❌ Failed to fetch profile data:', err);
      }
    });
  }

  openAvatar() {
    this.router.navigate(['/avatar']);
  }


  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2).toUpperCase();
  }

  onWalletAction(label: string) {
    if (label === 'Deposit') {
      this.router.navigate(['/deposit']);
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


  onSetting(label: string) {
    console.log('Clicked setting:', label);
    if (label == 'Terms and conditions') {
      this.router.navigate(['/t&c']);
    } else if (label == 'Help & support') {
      // do nothing as of now
    } else if (label == 'Change password') {
      localStorage.setItem("email", this.user.email)
      this.router.navigate(['/change-password']);
    } else if (label == 'Set Transaction Password') {
      this.router.navigate(['/set-transaction-password']);
    } else if (label == 'Transaction History') {
      // this.router.navigate(['/history']);
    }
  }

  logout() {
    console.log('Logged out');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    this.router.navigate(['/signin']);
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
