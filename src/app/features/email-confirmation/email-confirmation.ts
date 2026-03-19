import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TopNav } from '../top-nav/top-nav';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  imports: [CommonModule, MatButtonModule, TopNav, TranslatePipe, RouterModule],
  templateUrl: './email-confirmation.html',
  styleUrl: './email-confirmation.scss'
})
export class EmailConfirmation implements OnInit {

  email: string | null = null;
  otp: string | null = null;  // 'code' from query params

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Read query params: /email-confirm?code=1234&email=mani@gmail.com
    this.route.queryParams.subscribe(params => {
      this.otp = params['otp'] || null;
      this.email = params['email'] || null;

      if (this.email && this.otp) {
        this.verifyOtp();
        console.log(this.email, this.otp);
      } else {
        console.error("Missing query params.");
      }
    });
  }

  verifyOtp() {
    const payload = {
      email: this.email,
      otp: this.otp
    };

    this.auth.verifyOtp(payload).subscribe({
      next: (res) => {
        if (res.success === 200) {

          // Save userId in localStorage (browser only)
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem("userId", res.data.userId);
          }
        }
      },
      error: (err) => {
        console.error("Email verification failed", err);
      }
    });
  }

  continueForward() {
    this.router.navigate(['/home']);
  }

  
}