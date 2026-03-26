import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-smart-filters',
  standalone: true,
  imports: [CommonModule, RouterModule, TopNav, TranslatePipe],
  templateUrl: './smart-filters.html',
  styleUrl: './smart-filters.scss'
})
export class SmartFilters {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  filters = [
    {
      label: 'All Transaction',
      desc: 'View recent history.',
      icon: '/all-trans.svg',
      value: 'all'
    },
    {
      label: 'Your deposits',
      desc: 'See all your top-ups.',
      icon: '/deposits-filters-changed.svg',
      value: 'deposit'
    },
    {
      label: 'Your withdrawals',
      desc: 'View recent cashouts.',
      icon: '/credits-filter.svg',
      value: 'withdraw'
    },
    {
      label: 'Commission & rewards',
      desc: 'Check your earnings.',
      icon: '/rewards-filter.svg',
      value: 'reward'
    }
  ];

  goBack() {
    this.router.navigate(['/history']);
  }

  selectFilter(value: string) {
    this.router.navigate(['/history'], { queryParams: { filter: value } });
  }
}
