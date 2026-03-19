import { Component, PLATFORM_ID, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TopNav } from '../top-nav/top-nav'
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '../../pipes/translate-pipe';
@Component({
  selector: 'app-withdrawal',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
    TopNav,
    TranslatePipe
  ],
  templateUrl: './withdrawal.html',
  styleUrl: './withdrawal.scss'
})
export class Withdrawal implements OnInit {
  totalRemainingBalance: number = 0;
  withdrawAddress: string = '';

  withdrawalForm: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.withdrawalForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(20)]],
      walletAddress: ['', Validators.required],
      pin: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('🔹 Loading withdrawal data for user');
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.loadWithdrawalData(userId);
      } else {
        console.error('No userId found in localStorage');
      }
    }
  }
  loadWithdrawalData(userId: string) {
    const payload = { screen: 'withdrawal', userId };

    this.authService.avengers(payload).subscribe({
      next: (res) => {
        console.log('Withdrawal API response:', res);
        if (res.statusCode === 200 && res.data) {
          this.totalRemainingBalance = res.data.totalRemainingBalance;
          const address = res.data.withdrawAddress || '';
          this.withdrawalForm.patchValue({ walletAddress: address });
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching withdrawal data:', err);
      }
    });
  }
  onSubmit() {
    console.log('🔹 Withdrawal form submitted');
    if (this.withdrawalForm.invalid) {
      this.withdrawalForm.markAllAsTouched();
      return;
    }

    const userId = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('userId')
      : null;

    if (!userId) {
      alert('User not found');
      return;
    }
    console.log('🔹 Withdrawal payload');
    // 🔹 Prepare payload for withdrawal API
    const payload = {
      userId,
      amount: Number(this.withdrawalForm.value.amount),
      passcode: this.withdrawalForm.value.pin,
      withdrawAddress: this.withdrawalForm.value.walletAddress
    };

    console.log('🔹 Sending withdrawal request:', payload);

    // 🔹 Call Avengers Withdraw API
    this.authService.withdraw(payload).subscribe({
      next: (res) => {
        console.log('✅ Withdrawal API response:', res);

        if (res.statusCode === 200) {
          this.totalRemainingBalance = res.data.remainingBalance || 0;
          this.snackBar.open('Withdraw Successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open(res.message || 'Withdrawal failed. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (err) => {
        console.error('Withdrawal request failed:', err);
        this.snackBar.open(err?.error?.message || 'Something went wrong. Please try again later.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

}
