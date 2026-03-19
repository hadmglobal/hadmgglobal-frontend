import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TopNav } from '../top-nav/top-nav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, CommonModule, TopNav, MatSnackBarModule, TranslatePipe],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword implements OnInit {

  form: any;
  urlEmail: string | null = null;
  otp: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private router: Router, private auth: AuthService, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit() {
    // Read query params if present

    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    this.urlEmail = this.route.snapshot.queryParamMap.get('email');
    this.otp = this.route.snapshot.queryParamMap.get('otp');
    console.log(this.urlEmail, this.otp)
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: (group: any) => this.matchPasswords(group)
      }
    );
  }

  matchPasswords = (group: any) => {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  };

  goBack() {
    this.router.navigate(['/profile']);
  }

  updatePassword() {
    let emailToSend = this.urlEmail ?? localStorage.getItem('email');

    let payload: any = {
      email: emailToSend,
      password: this.form.value.newPassword
    };

    if (this.otp) {
      payload.otp = this.otp;
    }
    console.log(payload);

    if (!this.otp) {
      this.auth.changePassword(payload).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            console.log("Done 200")
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 1000)
          }
        },
        error: (err) => {
          console.error("Password changed", err);
        }
      });
    } else {
      this.auth.resetPassword(payload).subscribe({
        next: (res) => {
          console.log('Response:', res);
          if (res.statusCode === 200) {
            this.snackBar.open('Password changed Successful! Welcome back!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            this.safeSetLocalStorage('userId', res.data.userId);
            this.safeSetLocalStorage('email', res.data.email);

            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.error("Password changed", err);
        }
      });
    }
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
}
