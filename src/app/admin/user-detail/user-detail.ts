import { Component, EventEmitter, Input, Output, NgZone, ChangeDetectorRef, OnChanges } from '@angular/core';
import { EmailModal } from '../email-modal/email-modal';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-user-detail',
  imports: [EmailModal, FormsModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss'
})
export class UserDetail implements OnChanges {

  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) { }
  @Output() openAmount = new EventEmitter<any>();

  prefilledWallet: any = null;
  editablePasscode: any = '';
  

  ngOnChanges() {
    if (this.user) {
      this.editablePasscode = this.user.passcode;
    }
  }



  @Input() user: any = null;

  @Output() add = new EventEmitter<any>();
  @Output() toggleStatus = new EventEmitter<any>();
  @Output() sendEmail = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();


  get formattedName() {
    if (!this.user?.name) return "";
    return this.user.name.split(' ').slice(0, 2).join(' ').toUpperCase();
  }

  triggerAdd(action: string) {
    this.add.emit({ action, user: this.user });
  }

  triggerStatusToggle() {
    this.toggleStatus.emit(this.user);
  }

  triggerSendEmail() {
    this.sendEmail.emit(this.user);
  }

  openAmountPopup(action: string, walletValue: number) {
    this.openAmount.emit({
      action: action === 'Deposit' ? 'Credit' : 'Debit',  // FIX 1
      row: this.user,
      wallet: walletValue,
      walletName: action
    });
  }

  onEmailSent(payload: { to: string[]; subject: string; html: string }) {

    let data = {
      emails: payload.to,
      subject: payload.subject,
      html: payload.html
    }
    this.authService.sendBulkEmails(data).subscribe({
      next: (res) => {
        console.log("✅ Users API Response:", res);
        if (res.statusCode === 200) {
          this.ngZone.run(() => {
            this.snackBar.open('Emails Sent Successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        console.error("❌ Users API Error:", err);
      }
    });
    console.log('Parent received send payload', payload);
  }

  onEmailClosed() {
    console.log('Email modal closed');
  }

  editPasscode() {
    console.log("Passcode edit clicked for:", this.user.email);
    console.log("Current Passcode:", this.editablePasscode);

    let data = {
      "email": this.user.email,
      "passcode": this.editablePasscode
    };
    this.authService.updatePasscode(data).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.ngZone.run(() => {
            this.snackBar.open('Passcode Updated successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        console.error("❌ Users API Error:", err);
      }
    });

  }


}