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
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TopNav } from '../top-nav/top-nav';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup implements OnInit {

  signupForm: FormGroup;
  hidePassword = true;

  selectedLanguage = 'en'; // Default selection

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private route: ActivatedRoute   // ⭐ Added
  ) {

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      epin: ['', [Validators.required]],
      confirmEpin: ['', Validators.required],
      terms: [true, Validators.requiredTrue],
      refferal: ['']  // ⭐ removed Validators.required
    },
      { validator: this.matchPins });   // ⭐ ONLY CHANGE
  }


  ngOnInit(): void {
    console.log("we are in Signup page");

    // ⭐ Step 1: Read referral code
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.signupForm.patchValue({ refferal: code });
      console.log("Referral code applied:", code);

      // ⭐ Step 2: Remove ?code= from URL (Google Safe Browsing fix)
      this.router.navigate([], {
        queryParams: {},
        replaceUrl: true
      });
    }
  }


  gmailOnly(control: any) {
    const value = control.value || '';
    return value.toLowerCase().endsWith('@gmail.com') ? null : { gmailOnly: true };
  }

  matchPins(form: FormGroup) {
    const epin = form.get('epin')?.value;
    const confirmEpin = form.get('confirmEpin')?.value;

    if (epin && confirmEpin && epin !== confirmEpin) {
      form.get('confirmEpin')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmEpin')?.setErrors(null);
    }

    return null;
  }


  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    this.signupForm.markAllAsTouched();
    console.log(this.signupForm.value);
    if (this.signupForm.valid) {
      const payload = {
        userName: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        passcode: this.signupForm.value.epin,
        refferedCode: this.signupForm.value.refferal || ''   // ⭐ safe
      };

      console.log('Signup payload:', payload);
      localStorage.setItem('signup', JSON.stringify(payload));
      this.authService.signup(payload).subscribe({
        next: (res) => {
          if (res.statusCode === 201) {
            this.snackBar.open('Account created successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            localStorage.setItem('userId', res.data.userId);
            setTimeout(() => this.router.navigate(['/signin']), 1000);
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
    } else {
      this.signupForm.markAllAsTouched();
      this.snackBar.open('Please fill in all fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
