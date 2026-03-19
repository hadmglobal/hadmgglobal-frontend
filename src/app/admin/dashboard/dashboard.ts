import { Component, OnInit, NgZone, Inject, ChangeDetectorRef,PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {  isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  stats: any = {
    totalDeposits: 0,
    totalAmount: 0,
    totalWithdraw: 0,
    totalUsers: 0
  };
  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

   ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboard();
    }
  }
  loadDashboard() {
    const payload = { screen: 'Dashboard' };

    console.log("📌 Calling Admin Dashboard API", payload);

    this.authService.admin(payload).subscribe({
      next: (res) => {
        console.log("✅ Admin Dashboard Response:", res);

        if (res.statusCode === 200 && res.data) {
          this.ngZone.run(() => {
            this.stats = {
              totalDeposits: res.data.totalDepositors,
              totalAmount: res.data.totalAmount,
              totalWithdraw: res.data.totalWithdraw,
              totalUsers: res.data.totalUsers
            };

            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        console.error("❌ Dashboard API Error:", err);
      }
    });
  }
}

