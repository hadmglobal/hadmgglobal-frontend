import { Component, Input, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe } from '../../pipes/translate-pipe';


@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './transfer.html',
  styleUrl: './transfer.scss'
})
export class Transfer implements OnInit {

  @Input() mainWallet = 0;
  @Input() withdrawalWallet = 0;
  private authService = inject(AuthService);

  @Output() closed = new EventEmitter<void>();

  constructor(
    private snackBar: MatSnackBar,
  ) { }

   ngOnInit(): void {

  }


  isVisible = false;
  amount: number | null = null;

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
    this.amount = null;

    this.closed.emit();
  }

  setMax() {
    this.amount = this.withdrawalWallet;
  }

  transfer() {
    if (!this.amount || this.amount <= 0) return;
    console.log('Transfer amount:', this.amount);

    if (this.amount > this.withdrawalWallet) {
      console.log("Insufficient funds");
    }

    const userId = localStorage.getItem('userId');
    if (!userId) return;
    let payload = {
      "userId": userId,
      "amount": this.amount

    }


    this.authService.transfer(payload).subscribe({
      next: (res) => {
        console.log('✅ Amount converted:', res);

        if (res.statusCode !== 200 || !res.data) {
          console.warn('⚠️ Amount Not converted');
          return;
        } else {
          this.snackBar.open("Transfer completed successfully", 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.closeModal();
        }
      },
      error: (err) => {
        console.error('❌ Failed to convert amount:', err.error.message);
        let errmsg = err.error.message;
        if(err?.error?.message == "Insufficient earnings to convert") errmsg = "Insufficient amount to transfer"
        this.snackBar.open(errmsg, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
      }
    });
  }

}