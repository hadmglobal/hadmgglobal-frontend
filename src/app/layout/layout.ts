import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { TopNav } from '../features/top-nav/top-nav';
import { CommonModule } from '@angular/common';


import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, MatButtonModule, MatIconModule, FlexLayoutModule, TopNav, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  constructor(private router: Router) {}

  get isHome() {
    return this.router.url.includes('/home');
  }
}
