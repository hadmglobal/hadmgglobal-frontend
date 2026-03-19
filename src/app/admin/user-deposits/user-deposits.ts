import { Component, OnInit, NgZone, Inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-deposits',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-deposits.html',
  styleUrl: './user-deposits.scss'
})
export class UserDeposits implements OnInit {
  Math = Math;

  deposits: any[] = [];
  filteredDeposits: any[] = [];
  searchText = '';
  pageSize = 10;
  currentPage = 1;
  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadSampleData();
  }

  loadSampleData() {
    this.deposits = [];
    this.authService.getDeposit().subscribe({
      next: (res) => {
        console.log("✅ Deposit API Response:", res);
        if (res.statusCode === 200) {
          this.ngZone.run(() => {
            this.deposits = res.data?.deposits || [];
            this.filteredDeposits = [...this.deposits];
            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        console.error("❌ Users API Error:", err);
      }
    });
  }

  get paginatedDeposits() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDeposits.slice(start, start + this.pageSize);
  }

  searchDeposits() {
    const t = this.searchText.toLowerCase();
    this.filteredDeposits = this.deposits.filter(d =>
      d.username.toLowerCase().includes(t) ||
      d.transactionId.toLowerCase().includes(t) ||
      d.status.toLowerCase().includes(t)
    );
    this.currentPage = 1;
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredDeposits.length)
      this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1)
      this.currentPage--;
  }

  checkStatus(trackId:any) {
    const payload = { track_id: trackId };

    this.authService.paymentStatus(payload).subscribe({
      next: (res) => {
        console.log('Payment Status:', res);
      },
      error: (err) => {
        console.error('Payment check failed:', err);
      }
    });
  }
}
