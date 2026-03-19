import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [CommonModule, MatIconModule, RouterModule, TopNav, TranslatePipe],
  templateUrl: './terms-and-conditions.html',
  styleUrl: './terms-and-conditions.scss'
})
export class TermsAndConditions implements OnInit {
  lastUpdated = '02-08-2025';

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('Terms and Conditions Page Loaded');
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

}
