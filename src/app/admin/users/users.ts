import { Component, OnInit, NgZone, Inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { UpdateAmount } from '../update-amount/update-amount';
import { AuthService } from '../../services/auth.service';
import { UserDetail } from '../user-detail/user-detail';
import { EmailModal } from '../email-modal/email-modal';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-users',
  imports: [CommonModule, MatIconModule, FormsModule, UpdateAmount, UserDetail, EmailModal],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  Math = Math;
  users: any[] = [];
  filteredUsers: any[] = [];
  searchText: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  showPopup = false;
  showDetail = false;
  prefilledWallet: any = '';
  showUserDetail = false;
  editingUser: any = null;


  selectedAction = '';
  selectedRow: any = null;
  allEmails = [];
  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    }
  }

  loadUsers() {
    const payload = { screen: 'Users' };

    console.log("📌 Calling Admin Users API:", payload);

    this.authService.admin(payload).subscribe({
      next: (res) => {
        console.log("✅ Users API Response:", res);

        if (res.statusCode === 200 && Array.isArray(res.data)) {
          this.allEmails = res.data.map((email: any) => email.email) || [];
          this.ngZone.run(() => {
            this.users = res.data;
            this.filteredUsers = [...this.users];
            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        console.error("❌ Users API Error:", err);
      }
    });
  }

  // 🔍 Filter users
  searchUsers() {
    const term = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.referralId.toLowerCase().includes(term) ||
        u.wallet.toString().includes(term) ||
        u.earnings.toString().includes(term)
    );
    this.currentPage = 1;
  }

  // 🧭 Pagination
  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredUsers.length)
      this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1)
      this.currentPage--;
  }

  // 🟢 Toggle Status (later API)
  toggleStatus(user: any) {
    user.status = !user.status;
    console.log('Toggled user:', user);
    let payload = {
      email: user.email,
      status: user.status
    }
    console.log("📌 Transaction Payload:", payload);
    this.authService.adminUpdateUserStatus(payload).subscribe({
      next: (res) => {
        console.log("✅ Transaction Response:", res);

        if (res.statusCode === 200) {
          alert(res.message || "Success");
          this.loadUsers();  // Reload UI with updated wallet/earnings
        }
      },
      error: (err) => {
        console.error("❌ Transaction Error:", err);
        alert("Something went wrong!");
      }
    });
  }

  openAddPopup(user: any, field: string) {
    console.log('Open popup for', field, 'of user', user);
  }

  closePopup() {
    this.showPopup = false;
  }

  handleSubmit(data: any) {
    console.log('Popup submitted:', data);
    const payload = {
      screen: data.screen,
      email: data.row.email,
      amount: data.amount,
      action: data.action,
    }
    console.log("📌 Transaction Payload:", payload);
    this.authService.adminTransactionAvengers(payload).subscribe({
      next: (res) => {
        console.log("✅ Transaction Response:", res);

        if (res.statusCode === 200) {
          alert(res.message || "Success");
          this.loadUsers();  // Reload UI with updated wallet/earnings
        }
      },
      error: (err) => {
        console.error("❌ Transaction Error:", err);
        alert("Something went wrong!");
      }
    });
    this.showPopup = false;
  }

  openPopup(action: string, row: any, wallet: number) {
    this.selectedAction = action;
    this.selectedRow = row;
    this.prefilledWallet = wallet;     // ⭐ STORE PREFILL VALUE
    this.showPopup = true;
  }

  sendEmail(user: any) {
    console.log("📧 Send email clicked:", user);
  }

  openUserDetail(user: any) {
    this.selectedRow = user;
    this.showDetail = true;
  }

  closeUserDetail() {
    this.showDetail = false;
    this.loadUsers()
  }

  onEmailSent(payload: { to: string[]; subject: string; html: string }) {
    let data = {
      emails: payload.to,
      subject: payload.subject,
      html: payload.html
    }
    this.authService.sendBulkEmails(data).subscribe({
      next: (res) => {
        console.log("✅ Users API Response:", res);
        if (res.statusCode === 200) {
          this.ngZone.run(() => {
            this.snackBar.open('Emails Sent Successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        console.error("❌ Users API Error:", err);
      }
    });
    console.log('Parent received send payload', data);
  }

  onEmailClosed() {
    console.log('Email modal closed');
  }

  openTeamDetails(user: any) {
    this.router.navigate(['/admin/teams'], {
      queryParams: { userId: user.userId }
    });
  }

}
