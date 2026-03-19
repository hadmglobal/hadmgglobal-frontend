import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TopNav } from '../top-nav/top-nav';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule, MatButtonModule, TopNav, TranslatePipe, RouterModule,MatSnackBarModule,],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss'
})
export class VerifyEmail implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.router.navigate(['/signin']), 10000);
  }
  onSubmit(){
    console.log("calling")
    const data = JSON.parse(localStorage.getItem('signup') || '{}');
    console.log(data)
    this.authService.signup(data).subscribe({
        next: (res) => {
          if (res.statusCode === 201) {
            this.snackBar.open('Verification link sent to Gmail', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            localStorage.setItem('userId', res.data.userId);
          }
        },
        error: (err) => {
          console.error('Signup error:', err);
          this.snackBar.open(
            err.error?.message || 'Something went wrong!',
            'Close',
            { duration: 3000, panelClass: ['error-snackbar'] }
          );
        }
      });
  }

}
