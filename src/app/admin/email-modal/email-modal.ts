import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './email-modal.html',
  styleUrl: './email-modal.scss'
})
export class EmailModal {
  @Input() recipients: string | string[] = []; // can be string or array
  @Input() subjectPlaceholder = 'Subject';
  @Input() messagePlaceholder = 'Type your message...';

  @Output() sent = new EventEmitter<{ to: string[]; subject: string; html: string }>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('editor', { static: false }) editor!: ElementRef<HTMLDivElement>;
  @ViewChild('subjectInput', { static: false }) subjectInput!: ElementRef<HTMLInputElement>;

  show = false;
  subject = '';
  // small internal state for toolbar
  linkMode = false;

  // a safe default logo image (your uploaded file). Environment will convert local path to URL.
  logoUrl = '';

  constructor(private renderer: Renderer2) { }

  open(to?: string | string[]) {
    if (to) this.recipients = to;
    this.show = true;

    // Clear previous content (optional)
    setTimeout(() => {
      if (this.editor) this.editor.nativeElement.innerHTML = '';
    }, 0);

    // focus subject
    setTimeout(() => {
      this.subjectInput?.nativeElement?.focus?.();
    }, 50);
  }

  close() {
    this.show = false;
    this.closed.emit();
  }

  getRecipientsArray(): string[] {
    if (!this.recipients) return [];
    return Array.isArray(this.recipients) ? this.recipients : [this.recipients];
  }

  // ---- Rich text helpers using execCommand (works well for simple editor) ----
  format(command: string, value: string | null = null) {
    // convert null → undefined
    const safeValue = value === null ? undefined : value;

    document.execCommand(command, false, safeValue);

    // keep focus in editor
    this.editor?.nativeElement?.focus();
  }


  insertLink() {
    const url = prompt('Enter the URL');
    if (url) {
      this.format('createLink', url);
    }
  }

  insertImage() {
    // default to the provided logo url so user can insert a quick image (local file path included)
    const url = prompt('Enter image URL (or leave blank to insert default)', this.logoUrl);
    if (url) {
      this.format('insertImage', url);
    }
  }

  // clear editor content
  clear() {
    if (this.editor) this.editor.nativeElement.innerHTML = '';
  }

  // Collect content and emit + console log
  send() {
    const to = this.getRecipientsArray();
    console.log("MANI TEST",to)
    const subject = this.subject || '';
    const html = this.editor ? this.editor.nativeElement.innerHTML : '';

    // basic validation
    if (to.length === 0) {
      console.warn('No recipients provided');
    }

    // Console output (as you asked)
    console.log('--- Send Email Payload ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML message:', html);
    console.log('--------------------------');

    // Emit to parent so real send API can run
    this.sent.emit({ to, subject, html });

    // close after send (you can change this behaviour)
    this.close();
  }

  getFormattedRecipients(): string {
    const emails = this.getRecipientsArray();
    const count = emails.length;

    if (count === 0) return "No recipients";
    if (count === 1) return emails[0];
    if (count === 2) return `${emails[0]}, ${emails[1]}`;

    const remaining = count - 2;
    return `${emails[0]}, ${emails[1]} and ${remaining} others`;
  }
  
}