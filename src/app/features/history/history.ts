import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';
import { AuthService } from '../../services/auth.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { TranslatePipe } from '../../pipes/translate-pipe';

interface Transaction {
  type: string;
  amount: number;
  timestamp: string;
  transactionId: string;
  status: string;
  adminReward: boolean;
  isConverted: boolean;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule, TopNav, TranslatePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  transactions: Transaction[] = [];
  groupedTransactions: { date: string; transactions: Transaction[] }[] = [];
  activeFilter = 'all';
  isLoading = true;
  errorMessage = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private clipboard = inject(Clipboard);
  private ngZone = inject(NgZone);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // 🔹 Listen for filter changes in URL
    this.route.queryParams.subscribe(params => {
      if (params['filter']) {
        this.activeFilter = params['filter'];
      }
      this.loadData();
    });
  }

  loadData() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.fetchTransactionHistory(userId);
      } else {
        // Use dummy data if no userId for preview
        this.useDummyData();
      }
    }
  }

  fetchTransactionHistory(userId: string) {
    const payload = { screen: 'history', userId: userId };
    this.isLoading = true;

    this.authService.avengers(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.statusCode === 200 && response.data?.transactions) {
          this.ngZone.run(() => {
            this.transactions = response.data.transactions.map((t: any) => ({
              ...t,
              amount: parseFloat(t.amount),
            }));
            this.applyFilter();
          });
        } else {
          this.useDummyData(); // Fallback to dummy data
        }
      },
      error: (err) => {
        console.error('❌ API Error, using dummy data:', err);
        this.useDummyData();
      },
    });
  }

  useDummyData() {
    this.isLoading = false;
    this.transactions = [
      { type: 'withdraw', amount: 7500, timestamp: new Date().toISOString(), transactionId: 'AACINGXR7GIGUU3FAINLZDWX', status: 'paid', adminReward: false, isConverted: false },
      { type: 'deposit', amount: 7500, timestamp: new Date().toISOString(), transactionId: 'AACINGXR7GIGUU3FAINLZDWX', status: 'paid', adminReward: false, isConverted: false },
      { type: 'deposit', amount: 7500, timestamp: new Date().toISOString(), transactionId: 'AACINGXR7GIGUU3FAINLZDWX', status: 'paid', adminReward: false, isConverted: false },
      { type: 'deposit', amount: 7500, timestamp: new Date(Date.now() - 86400000).toISOString(), transactionId: 'AACINGXR7GIGUU3FAINLZDWX', status: 'paid', adminReward: false, isConverted: false },
      { type: 'reward', amount: 7500, timestamp: new Date(Date.now() - 86400000).toISOString(), transactionId: 'AACINGXR7GIGUU3FAINLZDWX', status: 'paid', adminReward: true, isConverted: false },
      { type: 'withdraw', amount: 7500, timestamp: new Date(Date.now() - 86400000).toISOString(), transactionId: 'AACINGXR7GIGUU3FAINLZDWX', status: 'paid', adminReward: false, isConverted: false },
    ];
    this.applyFilter();
  }

  applyFilter() {
    const filtered = this.activeFilter === 'all'
      ? this.transactions
      : this.transactions.filter(tx => {
          if (this.activeFilter === 'reward') return tx.type === 'reward';
          return tx.type === this.activeFilter;
        });
    this.groupTransactionsBy(filtered);
  }

  private groupTransactionsBy(transactions: Transaction[]) {
    const today = new Date().toDateString();
    const groups: { [key: string]: Transaction[] } = {};

    const sorted = [...transactions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    sorted.forEach((tx) => {
      const txDate = new Date(tx.timestamp);
      const formattedDate = txDate.toDateString() === today ? 'Today' : 'Yesterday'; // Simplified for design preview

      if (!groups[formattedDate]) groups[formattedDate] = [];
      groups[formattedDate].push(tx);
    });

    this.groupedTransactions = Object.entries(groups)
      .map(([date, transactions]) => ({ date, transactions }))
      .sort((a, b) => (a.date === 'Today' ? -1 : 1));
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  openFilterPage() {
    this.router.navigate(['/smart-filters']);
  }

  copyCode(val: string) {
    if (val) {
      this.clipboard.copy(val);
      console.log('Copied:', val);
    }
  }
}
