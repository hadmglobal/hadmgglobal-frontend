import {
  Component,
  ViewChild,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { TopNav } from '../top-nav/top-nav'
import { TranslatePipe } from '../../pipes/translate-pipe';
@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, CommonModule, TopNav, MatSnackBarModule, TranslatePipe],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss'
})
export class ForgetPassword implements OnInit {
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

  private cdr = inject(ChangeDetectorRef);
  isDisable = false;
  form: any;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]]
      }
    );
  }


  goBack() {
    this.router.navigate(['/signin']);
  }

  resend() {
    console.log("Re-send email", this.form.value.email)
    const payload = {
      email: this.form.value.email,
    };

    console.log('📌 Calling Avengers Profile API:', payload);

    this.authService.forgotPassword(payload).subscribe({
      next: (res) => {
        console.log('✅ Profile API Response:', res);

        if (res.statusCode !== 200 || !res.data) {
          console.warn('⚠️ No profile data received');
          return;
        }
        this.ngZone.run(() => {
          this.isDisable = true
          this.form.email = ''
          this.snackBar.open('Email Sent Successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.cdr.detectChanges();
        });
      },

      error: (err) => {
        console.error('❌ Failed to fetch profile data:', err);
      }
    });
  }

}
