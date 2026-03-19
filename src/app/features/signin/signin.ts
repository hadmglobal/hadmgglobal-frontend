import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TopNav } from '../top-nav/top-nav'

import { TranslatePipe } from '../../pipes/translate-pipe';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-signin',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    CommonModule,
    RouterModule,
    TopNav,
    TranslatePipe
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class Signin implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;

  selectedLanguage = 'en'; // Default selection

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {

    localStorage.removeItem('userId');
    localStorage.removeItem('email');

    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }


    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }
  ngOnInit(): void {
    console.log("we are in signin page");
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      const ADMIN_EMAILS = ["vincentjhon7826@gmail.com"];

      // ================================
      // ⭐ 1. ADMIN QUICK LOGIN (NO API)
      // ================================
      if (ADMIN_EMAILS.includes(email) && password == 'Support@#&10981234') {

        // Save to localStorage
        this.safeSetLocalStorage('email', email);
        // this.safeSetLocalStorage('userId', 'ADMIN_USER');

        this.snackBar.open('Admin Login Successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Redirect to admin dashboard
        this.router.navigate(['/admin/dashboard']);
        return;
      }

      // ================================
      // ⭐ 2. NORMAL USER LOGIN (API)
      // ================================
      const payload = {
        email: email,
        password: password
      };

      console.log('Sending payload:', payload);

      this.authService.login(payload).subscribe({
        next: (res) => {
          console.log('Response:', res);

          if (res.statusCode === 200 && res.data?.isActiveUser) {
            this.snackBar.open('Login Successful! Welcome back!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            this.safeSetLocalStorage('userId', res.data.userId);
            this.safeSetLocalStorage('email', email);

            this.router.navigate(['/home']);
          } else {
            this.snackBar.open(res.message || 'Invalid credentials', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (err) => {
          console.error('Login error:', err.error.message);
          let msg = err.error.message;
          if(msg == 'Invalid email or password') msg = 'Invalid password';
          this.snackBar.open(msg || 'Invalid Credentials', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.log('Form is invalid');
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }


  get passwordControl() { return this.loginForm.get('password'); }

  private performLogin() {
    // Simulate API call delay
    setTimeout(() => {
      // Show success message
      this.snackBar.open('Login Successful! Welcome back!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      // Navigate to home page after a short delay
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
    }, 100);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  private safeGetLocalStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return null;
  }

  private safeSetLocalStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(key, value);
      } catch {
        console.warn('Unable to access localStorage');
      }
    }
  }

  // forgetPassword() {
  //   this.router.navigate(['/forget']);
  // }

}

