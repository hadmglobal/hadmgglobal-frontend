import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TopNav } from '../top-nav/top-nav';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, TopNav],
  templateUrl: './avatar.html',
  styleUrls: ['./avatar.scss']
})
export class Avatar {
  private router = inject(Router);
  private authService = inject(AuthService);

  avatars = [
    '/avatar1.svg',
    '/avatar2.svg',
    '/avatar3.svg',
    '/avatar4.svg',
    '/avatar5.svg',
    '/avatar6.svg',
    '/avatar7.svg',
    '/avatar8.svg',
    '/avatar9.svg'
  ];

  selectedAvatar: string = this.avatars[0];

  ngOnInit() {
    // Optionally pre-select the currently active avatar from local storage or service
    const currentAvatar = localStorage.getItem('avatarUrl');
    if (currentAvatar && this.avatars.includes(currentAvatar)) {
      this.selectedAvatar = currentAvatar;
    }
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  applyAvatar() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/signin']);
      return;
    }

    // Call API integration to save avatar
    this.authService.updateAvatar({ userId, imageId: this.selectedAvatar }).subscribe({
      next: () => {
        localStorage.setItem('avatarUrl', this.selectedAvatar);
        this.goBack();
      },
      error: () => {
        // Fallback save and exit
        localStorage.setItem('avatarUrl', this.selectedAvatar);
        this.goBack();
      }
    });
  }
}
