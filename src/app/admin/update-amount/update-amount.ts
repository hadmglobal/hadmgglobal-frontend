import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-update-amount',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-amount.html',
  styleUrl: './update-amount.scss'
})
export class UpdateAmount implements OnChanges {

  @Input() show = false;
  @Input() actionType: string = '';
  @Input() rowData: any;
  @Input() prefilledWallet: any = '';   // ⭐ NEW — wallet passed from UserDetail

  @Output() close = new EventEmitter<void>();
  @Output() submitData = new EventEmitter<any>();

  @Input() walletName: string = '';


  formData = {
    screen: '',
    wallet: '',
    amount: '',
    description: '',
    action: ""
  };

  ngOnChanges() {
    if (this.actionType && this.rowData) {

      // Set action dropdown (Credit / Debit)
      this.formData.action = this.actionType;
      this.formData.screen = this.actionType == "Debit"? 'Withdraw':'Deposit';

      // Determine wallet type
      const isDeposit = this.actionType === 'Debit';

      // LABEL: Working Wallet / Withdrawal Wallet
      this.formData.wallet =
        isDeposit ? 'Working Wallet' : 'Withdrawal Wallet';

      // AMOUNT: Pre-fill current amount
      this.formData.amount =
        isDeposit ? this.rowData.earnings : this.rowData.wallet;
    }

    console.log("Wallet coming from UserDetail:", this.actionType);

  }


  closeModal() {
    this.close.emit();
  }

  submitForm() {
    this.submitData.emit({ ...this.formData, row: this.rowData });
    this.closeModal();
  }
}