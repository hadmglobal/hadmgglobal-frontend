import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

import { Language } from '../../services/language';

@Component({
  selector: 'app-top-nav',
  imports: [MatFormFieldModule,MatInputModule,MatButtonModule,MatSelectModule,MatMenuModule,CommonModule,RouterModule],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.scss'
})
export class TopNav {
  @Input() isTransparent = false;
  @Input() isWhite = false;

  langService = inject(Language);

  get languages() {
    return this.langService.languages;
  }

  get selectedLang() {
    return this.langService.currentLanguage;
  }

  onLanguageChange(lang: string) {
    this.langService.setLanguage(lang);
  }

  onNativeLangChange(event: any) {
    this.langService.setLanguage(event.target.value);
  }

}
