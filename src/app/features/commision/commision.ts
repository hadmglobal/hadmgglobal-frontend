import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-commision',
  imports: [CommonModule, RouterModule, TopNav, TranslatePipe],
  templateUrl: './commision.html',
  styleUrl: './commision.scss'
})
export class Commision {
  commissionDetails: any = [];
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.fetchCommissionDetails(userId);
      } else {
        console.error('❌ No userId found in localStorage');
      }
    }
  }

  // 🔹 Fetch data from Avengers API
  fetchCommissionDetails(userId: string) {
    const payload = {
      screen: 'commission',
      userId: userId,
    };

    console.log('🚀 Fetching commission details:', payload);

    this.authService.avengers(payload).subscribe({
      next: (res) => {
        console.log('✅ Commission API response:', res);

        if (res.statusCode === 200 && res.data?.commissionDetails) {
          // Run UI updates in Angular zone for correct re-render
          this.ngZone.run(() => {
            this.commissionDetails = res.data.commissionDetails;
            this.cdr.detectChanges();
          });
        } else {
          console.warn('⚠️ No commission data found or invalid response');
          this.commissionDetails = [];
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('❌ Failed to fetch commission details:', err);
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleString('en-US', options);
  }

  goBack() {
    this.router.navigate(['/team']);
  }
}
