import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ Required for *ngFor, *ngIf


//Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

//Servive Imports
import { Language } from '../../services/language';


@Component({
  selector: 'app-top-nav',
  imports: [MatFormFieldModule,MatInputModule,MatButtonModule,MatSelectModule,CommonModule],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.scss'
})
export class TopNav {

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

}
