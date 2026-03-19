import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { title } from 'process';
import { TranslatePipe } from '../../pipes/translate-pipe';
@Component({
  selector: 'app-team',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './team.html',
  styleUrl: './team.scss'
})
export class Team implements OnInit {
  userName = '';
  data: any = {};
  levels: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    // Simulated API Response
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) this.fetchTeamData(userId);
    }
  }
  fetchTeamData(userId: string) {
    this.isLoading = true;
    const payload = {
      screen: 'teams',
      userId: userId
    };

    this.authService.avengers(payload).subscribe({
      next: (response) => {
        console.log('✅ Team API response:', response);
        this.isLoading = false;

        if (response.statusCode === 200 && response.data) {
          const data = response.data;

          this.data = {
            totalTeams: data.totalDownlines,
            totalPromationComission: data.totalPromationComission,
            teamRecharge: data.teamRecharge,
            teamWitdrawls: data.teamWitdrawls
          };
          this.userName = data.username;

          // 🔹 Determine the max from reffered counts (for progress bars)
          const max = Math.max(
            data.genOne?.reffered || 0,
            data.genTwo?.reffered || 0,
            data.genThree?.reffered || 0
          );

          this.levels = [
            {
              id: "First Generation Data",
              title: "First Generation Data",
              value: data.genOne?.valid || 0,
              max: data.genOne?.reffered || 0,
              color: '#ED5F9B',
              progress: data.genOne?.reffered
                ? Math.round(((data.genOne?.valid || 0) / data.genOne.reffered) * 100)
                : 0
            },
            {
              id: 2,
              title: "Second Generation Data",
              value: data.genTwo?.valid || 0,
              max: data.genTwo?.reffered || 0,
              color: '#2CB280',
              progress: data.genTwo?.reffered
                ? Math.round(((data.genTwo?.valid || 0) / data.genTwo.reffered) * 100)
                : 0
            },
            {
              id: 3,
              title: "Third Generation Data",
              value: data.genThree?.valid || 0,
              max: data.genThree?.reffered || 0,
              color: '#2FBDC1',
              progress: data.genThree?.reffered
                ? Math.round(((data.genThree?.valid || 0) / data.genThree.reffered) * 100)
                : 0
            }
          ];


          // ✅ Force UI update
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('❌ Failed to fetch Team data:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load team data.';
        this.cdr.detectChanges();
      }
    });
  }
  openMembers(level: number) {
    console.log('🔹 Navigating to members of level', level);
    this.router.navigate(['/members'], { queryParams: { level } });
  }


}
