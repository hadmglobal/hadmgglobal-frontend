import { Component, OnInit, NgZone, Inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-withdraw-rejects',
  imports: [CommonModule, FormsModule],
  templateUrl: './withdraw-rejects.html',
  styleUrl: './withdraw-rejects.scss'
})
export class WithdrawRejects implements OnInit {
  withdraws: any[] = [];
  filteredWithdraws: any[] = [];
  paginatedWithdraws: any[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchText = '';
    constructor(
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId))
    this.fetchWithdrawRequests();
  }
   fetchWithdrawRequests() {
    const payload = {
      status: "Rejected"
    };


    this.auth.adminWithdrawFilter(payload).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          if (res.statusCode === 200 && Array.isArray(res.data)) {

            this.withdraws = res.data.map((item:any) => {
              const charge = item.amount * 0.02;         // 2% static fee
              const total = item.amount - charge;        // amount - 2%
              return {
                user: item.user,
                amount: item.amount,
                charge: charge,
                total: total,
                wallet: item.wallet,
                withdrawId: item.withdrawId,
                status: item.status
              };
            });
            this.filteredWithdraws = [...this.withdraws];
             this.updatePagination();
          }
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        console.error("Withdraw API Error:", err);
        this.cd.detectChanges();
      }
    });
  }

  get totalPages() {
    return Math.ceil(this.filteredWithdraws.length / this.itemsPerPage);
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedWithdraws = this.filteredWithdraws.slice(start, end);
  }

  changePage(direction: number) {
    this.currentPage += direction;
    this.updatePagination();
  }

  filterWithdraws() {
    const text = this.searchText.toLowerCase().trim();

    this.filteredWithdraws = this.withdraws.filter(w =>
      Object.values(w).some(v =>
        v !== null &&
        v !== undefined &&
        v.toString().toLowerCase().includes(text)
      )
    );

    this.currentPage = 1;
    this.updatePagination();
  }

  copyWallet(wallet: string) {
    navigator.clipboard.writeText(wallet);
    alert('Wallet address copied!');
  }
}
