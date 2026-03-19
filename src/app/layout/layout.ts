import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { TopNav } from '../features/top-nav/top-nav'


@Component({
  selector: 'app-layout',
  imports: [RouterModule, MatButtonModule, MatIconModule, FlexLayoutModule,TopNav],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
