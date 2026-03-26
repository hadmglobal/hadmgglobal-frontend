import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transaction-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TopNav, TranslatePipe, MatSnackBarModule],
  templateUrl: './transaction-password.html',
  styleUrl: './transaction-password.scss'
})
export class TransactionPassword implements OnInit {
  form: any;
  isLoading = false;
  lastUpdated = '01-10-2024';

  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: (group: any) => this.matchPasswords(group)
      }
    );
    console.log('Transaction Password Component Loaded');
  }

  matchPasswords = (group: any) => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  };

  goBack() {
    this.router.navigate(['/profile']);
  }

  updatePassword() {
    if (this.form.invalid) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.snackBar.open('User ID not found. Please log in again.', 'Close', { duration: 3000 });
      this.router.navigate(['/signin']);
      return;
    }

    this.isLoading = true;
    const payload = {
      userId: userId,
      password: this.form.value.password
    };

    console.log('📌 Calling Set Transaction Password API:', payload);

    this.authService.setTransactionPassword(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.statusCode === 200) {
          this.snackBar.open('Transaction password updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/profile']);
        } else {
          this.snackBar.open(res.message || 'Failed to update password', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Password Update Error:', err);
        this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
