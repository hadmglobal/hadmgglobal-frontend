import { Component, OnInit, NgZone, Inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-withdraw-request',
  imports: [CommonModule, FormsModule,MatSnackBarModule],
  templateUrl: './withdraw-request.html',
  styleUrl: './withdraw-request.scss'
})
export class WithdrawRequest implements OnInit {
  Math = Math;
  withdraws: any[] = [];
  filteredWithdraws: any[] = [];
  searchText = '';
  itemsPerPage = 10;
  currentPage = 1;
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
      status: "pending"
    };


    this.auth.adminWithdrawFilter(payload).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          if (res.statusCode === 200 && Array.isArray(res.data)) {

            this.withdraws = res.data.map((item:any) => {
              const charge = item.amount * 0.08;         // 8% static fee
              const total = item.amount - charge;        // amount - 8%
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

  // ✅ Search function
  filterWithdraws() {
    const text = this.searchText.toLowerCase();
    this.filteredWithdraws = this.withdraws.filter(
      w =>
        w.user.toLowerCase().includes(text) ||
        w.wallet.toLowerCase().includes(text) ||
        w.withdrawId.toLowerCase().includes(text) ||
        w.status.toLowerCase().includes(text)
    );
  }

  // ✅ Pagination controls
  get paginatedWithdraws() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredWithdraws.slice(start, start + this.itemsPerPage);
  }

  changePage(offset: number) {
    const totalPages = Math.ceil(this.filteredWithdraws.length / this.itemsPerPage);
    this.currentPage = Math.min(Math.max(this.currentPage + offset, 1), totalPages);
  }

  // ✅ Copy wallet address
  copyWallet(address: string) {
    navigator.clipboard.writeText(address);
    alert('Wallet address copied!');
  }

  handleDecision(action: 'Approve' | 'Reject', item: any) {
    console.log(`${action.toUpperCase()} clicked for:`, item);
    this.filteredWithdraws = this.filteredWithdraws.filter(w => w !== item);
    this.withdraws = this.withdraws.filter(w => w !== item);
   const payload = {
       withdrawId: item.withdrawId,
       status: action
    };


    this.auth.adminWithdrawConfirm(payload).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          if (res.statusCode === 200 && Array.isArray(res.data)) {
              this.cd.detectChanges();
          }
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        console.error("Withdraw confirm Error:", err);
        this.cd.detectChanges();
      }
    });
  }

}
