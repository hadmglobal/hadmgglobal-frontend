import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TopNav } from '../top-nav/top-nav';
import { Router } from '@angular/router';

import { TranslatePipe } from '../../pipes/translate-pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-maintainance',
  imports: [CommonModule, MatButtonModule, TopNav, TranslatePipe, RouterModule],
  templateUrl: './maintainance.html',
  styleUrl: './maintainance.scss'
})
export class Maintainance {

}
