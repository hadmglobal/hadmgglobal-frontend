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
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';

interface Member {
  name?: string;
  email: string;
  timestamp: string;
  balance: number;
  inviteCode: string; // Used as UID
}

@Component({
  selector: 'app-members',
  imports: [CommonModule, RouterModule, FormsModule, TopNav, TranslatePipe],
  templateUrl: './members.html',
  styleUrl: './members.scss'
})
export class Members implements OnInit {
  members: Member[] = [];
  filteredMembers: Member[] = [];
  searchText = '';
  level = 1;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    // 🔹 Extract level from query params
    this.route.queryParams.subscribe((params) => {
      this.level = params['level'] ? Number(params['level']) : 1;
      console.log('📘 Selected Level:', this.level);
      this.loadData();
    });
  }

  switchLevel(newLevel: number) {
    this.level = newLevel;
    this.loadData();
  }

  loadData() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.fetchMembers(userId, this.level);
      } else {
        console.error('❌ No userId found in localStorage');
        this.loadMockMembers();
      }
    }
  }

  loadMockMembers() {
    const names = ['Arjun Sharma', 'Priya Patel', 'Rahul Singh', 'Neha Gupta', 'Karan Verma', 'Anita Desai'];
    // Generate dummy members based on current level to show variations
    this.members = Array.from({ length: 6 }).map((_, i) => ({
      name: names[i % names.length] + ' ' + this.level,
      email: `user${i}@example.com`,
      timestamp: new Date(2024, 0, 10 - i).toISOString(),
      balance: 899 + (i * 50) + (this.level * 100),
      inviteCode: `${53700 + i + (this.level * 10)}`
    }));
    this.filteredMembers = [...this.members];
    this.cdr.detectChanges();
  }

  // 🔹 Fetch Members via Avengers API
  fetchMembers(userId: string, level: number) {
    let screen = '';
    switch (level) {
      case 1: screen = 'genOne'; break;
      case 2: screen = 'genTwo'; break;
      case 3: screen = 'genThree'; break;
      case 4: screen = 'genFour'; break;
      case 5: screen = 'genFive'; break;
      default: screen = 'genOne';
    }

    const payload = { screen, userId: userId };

    this.authService.avengers(payload).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && res.data?.memberDetails && res.data.memberDetails.length > 0) {
          this.ngZone.run(() => {
            this.members = res.data.memberDetails;
            this.filteredMembers = [...this.members];
            this.cdr.detectChanges();
          });
        } else {
            // Load dummy data for preview explicitly requested
            this.loadMockMembers();
        }
      },
      error: (err) => {
        console.error('❌ Failed to fetch members:', err);
        // Load dummy data for preview explicitly requested
        this.loadMockMembers();
      }
    });
  }

  filterMembers() {
    const text = this.searchText.toLowerCase();
    this.filteredMembers = this.members.filter(
      (m) =>
        (m.name || '').toLowerCase().includes(text) ||
        (m.inviteCode || '').toLowerCase().includes(text)
    );
  }

  maskEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length < 2) return email;
    const user = parts[0];
    const domain = parts[1];
    return user.slice(0, 3) + '*'.repeat(Math.max(3, user.length - 3)) + '@' + domain;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  goBack() {
    this.router.navigate(['/team']);
  }
}
