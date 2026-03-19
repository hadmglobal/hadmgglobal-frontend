import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-team-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './team-details.html',
  styleUrl: './team-details.scss'
})
export class TeamDetails implements OnInit {

  @Input() userEmail = "";

  activeLevel = 1;

  loading = true;
  data: any = null;

  // SEARCH
  searchQuery: any = { 1: "", 2: "", 3: "" };

  // PAGINATION
  currentPage: any = { 1: 1, 2: 1, 3: 1 };
  pageSize = 5;
  totalPages: any = { 1: 1, 2: 1, 3: 1 };

  // FILTERED + PAGINATED DATA
  filtered: any = { 1: [], 2: [], 3: [] };
  paginated: any = { 1: [], 2: [], 3: [] };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Subscribe to query params so navigation with only query param changes still triggers data load
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        this.fetchTeamData(userId);
      }
    });
  }

  fetchTeamData(userId: string) {
    this.loading = true;

    const payload = {
      screen: 'teams',
      userId: userId,
      isAdmin: true
    };

    this.authService.avengers(payload).subscribe({
      next: (response: any) => {
        console.log('✅ TeamDetails API response:', response);
        this.loading = false;

        if (response && response.statusCode === 200 && response.data) {
          // assign returned data to the component's data shape
          this.data = response.data;

          // If the API returns members as genOne.users etc., apply filters
          this.applyFiltersForAllLevels();
        }

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Failed to fetch TeamDetails data:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🔍 Apply search filter
  filterUsers() {
    this.applyFiltersForAllLevels();
  }

  applyFiltersForAllLevels() {
    this.applyFilterForLevel(1, this.data?.genOne?.users || []);
    this.applyFilterForLevel(2, this.data?.genTwo?.users || []);
    this.applyFilterForLevel(3, this.data?.genThree?.users || []);
  }

  applyFilterForLevel(level: number, users: any[]) {
    const q = (this.searchQuery[level] || '').toLowerCase();

    this.filtered[level] = users.filter((u: any) => {
      const name = (u.name || '').toString().toLowerCase();
      const email = (u.email || '').toString().toLowerCase();
      const ref = (u.referralId || '').toString().toLowerCase();

      return name.includes(q) || email.includes(q) || ref.includes(q);
    });

    this.totalPages[level] = Math.max(1, Math.ceil(this.filtered[level].length / this.pageSize));
    this.currentPage[level] = 1;

    this.updatePage(level);
  }

  updatePage(level: number) {
    const start = (this.currentPage[level] - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginated[level] = this.filtered[level].slice(start, end);
  }

  nextPage() {
    if (this.currentPage[this.activeLevel] < this.totalPages[this.activeLevel]) {
      this.currentPage[this.activeLevel]++;
      this.updatePage(this.activeLevel);
    }
  }

  prevPage() {
    if (this.currentPage[this.activeLevel] > 1) {
      this.currentPage[this.activeLevel]--;
      this.updatePage(this.activeLevel);
    }
  }

  back() {
    this.router.navigate(['/admin/users']);
  }
}
