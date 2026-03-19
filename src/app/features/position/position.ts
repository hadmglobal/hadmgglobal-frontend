import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-position',
  imports: [CommonModule],
  templateUrl: './position.html',
  styleUrl: './position.scss'
})
export class Position implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService, private cdr: ChangeDetectorRef,) { }

  allPositions: any[] = [];
  topThree: any[] = [];
  currentPosition: any;
  arrowDirection: 'up' | 'down' = 'down';
  colorMap: Map<number, string> = new Map();
  showSticky = false;
  isLoading = true;
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) this.getPositions(userId);
    }
  }
  getPositions(userId: string) {
  const payload = {
    screen: 'position',
    userId: userId,
  };

  this.authService.avengers(payload).subscribe({
    next: (response) => {
      this.isLoading = false;

      if (response.statusCode === 200 && response.data) {
        const { currentPosition, allPositions } = response.data;

        if (!currentPosition) {
          console.warn("⚠️ No current position received");
          return;
        }

        this.currentPosition = currentPosition;

        // ---- 🔥 FIX: Insert currentPosition into correct index ----
        const list = [...allPositions];
        const insertIndex = currentPosition.pid - 1;

        if (insertIndex >= 0 && insertIndex <= list.length) {
          list.splice(insertIndex, 0, currentPosition);
        } else {
          // fallback (should not happen)
          list.push(currentPosition);
        }

        // ---- 🔥 Recalculate top 3 and remaining ----
        this.topThree = list.slice(0, 3);
        this.allPositions = list.slice(3);

        this.cdr.detectChanges();

        // ---- 🔥 Auto scroll when DOM is ready ----
        setTimeout(() => {
          this.cdr.detectChanges();
          this.scrollToCurrent();
        }, 300);

        console.log("✅ Positions fixed & rendered correctly");
      } else {
        console.warn("⚠️ Unexpected API response:", response);
      }
    },
    error: (err) => {
      console.error('❌ Failed to fetch positions:', err);
    }
  });
}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Run only in browser environment
      // setTimeout(() => this.scrollToCurrent(), 500);
    }
  }

  scrollToCurrent() {
    if (!isPlatformBrowser(this.platformId)) return; // Prevent SSR errors
    const el = document.getElementById(`rank-${this.currentPosition.pid}`);
    if (!el || !this.scrollContainer) return;

    const container = this.scrollContainer.nativeElement;
    const offset =
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      container.clientHeight / 2;

    container.scrollTo({ top: offset, behavior: 'smooth' });
  }

  onScroll(event: Event) {
    const container = event.target as HTMLElement;
    const el = document.getElementById(`rank-${this.currentPosition.pid}`);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // 👇 Show sticky only when actual card is out of view
    const isVisible =
      rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;

    this.showSticky = !isVisible;

    if (rect.bottom < containerRect.top) {
      this.arrowDirection = 'down';
    } else if (rect.top > containerRect.bottom) {
      this.arrowDirection = 'up';
    }
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return parts.length > 1
      ? parts[0][0] + parts[1][0]
      : name.slice(0, 2).toUpperCase();
  }

  getRandomColor(pid: number): string {
    if (this.colorMap.has(pid)) return this.colorMap.get(pid)!;
    const colors = ['#E7EDFF', '#DFF8E1', '#FFE6E1', '#FFF7C2', '#E0F0FF'];
    const color = colors[pid % colors.length];
    this.colorMap.set(pid, color);
    return color;
  }
}
