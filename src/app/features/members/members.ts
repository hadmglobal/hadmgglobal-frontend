import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopNav } from '../top-nav/top-nav';
import { MatIconModule } from '@angular/material/icon';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';
interface Member {
  email: string;
  timestamp: string;
  balance: number;
  inviteCode: string;
}

@Component({
  selector: 'app-members',
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, TopNav, TranslatePipe],
  templateUrl: './members.html',
  styleUrl: './members.scss'
})
export class Members implements OnInit {
  members: Member[] = [];
  filteredMembers: Member[] = [];
  searchText = '';
  level: number | null = null;
  // constructor(private router: Router, private route: ActivatedRoute) { }

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    // 🔹 Extract level from query params
    this.route.queryParams.subscribe((params) => {
      this.level = params['level'] ? Number(params['level']) : null;
      console.log('📘 Selected Level:', this.level);

      if (isPlatformBrowser(this.platformId)) {
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.fetchMembers(userId, this.level);
        } else {
          console.error('❌ No userId found in localStorage');
        }
      }
    });
  }

  // 🔹 Fetch Members via Avengers API
  fetchMembers(userId: string, level: number | null) {
    // Dynamically map level → screen
    let screen = '';
    switch (level) {
      case 1:
        screen = 'genOne';
        break;
      case 2:
        screen = 'genTwo';
        break;
      case 3:
        screen = 'genThree';
        break;
      default:
        console.warn('⚠️ Invalid or missing level. Defaulting to genOne.');
        screen = 'genOne';
    }

    const payload = { screen, userId: userId };

    console.log('🚀 Fetching members with payload:', payload);

    this.authService.avengers(payload).subscribe({
      next: (res) => {
        console.log('✅ Avengers Members API Response:', res);

        if (res.statusCode === 200 && res.data?.memberDetails) {
          // Run UI updates inside Angular zone to ensure re-render
          this.ngZone.run(() => {
            this.members = res.data.memberDetails;
            this.filteredMembers = [...this.members];
            this.cdr.detectChanges();
          });
        } else {
          console.warn('⚠️ No members found or invalid response.');
          this.members = [];
          this.filteredMembers = [];
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('❌ Failed to fetch members:', err);
      }
    });
  }

  filterMembers() {
    const text = this.searchText.toLowerCase();
    this.filteredMembers = this.members.filter(
      (m) =>
        m.email.toLowerCase().includes(text) ||
        m.balance.toString().includes(text) ||
        m.inviteCode.toLowerCase().includes(text)
    );
  }

  maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    return (
      user.slice(0, 3) +
      '*'.repeat(Math.max(3, user.length - 3)) +
      '@' +
      domain
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  goBack() {
    this.router.navigate(['/team']);
  }

}
