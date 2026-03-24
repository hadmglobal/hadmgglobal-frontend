import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-success',
  imports: [CommonModule, RouterModule, TopNav, TranslatePipe],
  templateUrl: './success.html',
  styleUrl: './success.scss'
})
export class Success {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
