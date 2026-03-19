import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-adminlayout',
  imports: [CommonModule, RouterModule],
  templateUrl: './adminlayout.html',
  styleUrl: './adminlayout.scss',
  animations: [
    trigger('slideInOut', [
      state('void', style({ height: '0', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void <=> *', animate('200ms ease-in-out')),
    ]),
  ],
})
export class Adminlayout {

  isSidebarOpen = true;
  withdrawMenuOpen = false;

  // ⭐ NEW: Track active clicked menu
  currentActive: string | null = null;

  // ⭐ existing variable
  activeSection: string | null = null;

  constructor(private router: Router) { }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleWithdrawMenu() {
    this.withdrawMenuOpen = !this.withdrawMenuOpen;
    this.activeSection = 'withdrawls';
  }

  navigateTo(page: string, event?: Event) {
    if (event) event.stopPropagation();

    this.currentActive = page;

    // ⭐ If it's a withdrawl submenu → keep parent highlighted
    if (page.startsWith('withdrawl')) {
      this.activeSection = 'withdrawls';
    } else {
      // ⭐ FIX: Reset withdrawls highlight when clicking other menu items
      this.activeSection = null;
      this.withdrawMenuOpen = false; // also close submenu
    }

    this.router.navigate([`/admin/${page}`]);

    this.toggleSidebar();
  }


}