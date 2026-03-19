import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-game-success-screen',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './game-success-screen.html',
  styleUrl: './game-success-screen.scss'
})
export class GameSuccessScreen {
  isVisible = false;
  isClosing = false;

  constructor(private renderer: Renderer2) { }
  @Output() closed = new EventEmitter<void>();


  openModal() {
    if (this.isClosing) return;
    this.isVisible = true;
    this.isClosing = false;

    // ✅ prevent scroll
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'position', 'fixed');
    this.renderer.setStyle(document.body, 'width', '100%');
    window.scrollTo(0, 0);
  }

  closeModal() {
    if (this.isClosing) return;
    this.isClosing = true;

    // ⭐ Immediately restore scroll (fixes stuck scroll completely)
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'position');
    this.renderer.removeStyle(document.body, 'width');
    this.closed.emit();

    // ⭐ Continue with fade-out animation
    setTimeout(() => {
      this.isVisible = false;
      this.isClosing = false;
    }, 300); // match fade-out
  }


}
