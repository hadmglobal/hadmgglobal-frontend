import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  signup(payload: {
    userName: string;
    email: string;
    password: string;
    refferedCode?: string;
    passcode: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  forgotPassword(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, payload);
  }

  // Avengers api
  avengers(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/avengers`, payload);
  }

  confirmDeposit(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm`, payload);
  }

  withdraw(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, payload);
  }

  verifyOtp(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, payload);
  }

  changePassword(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, payload);
  }
  resetPassword(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, payload);
  }

  doPayment(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm`, payload);
  }

  paymentStatus(payload: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/payin-status/` + payload.track_id);
  }

  //adminapis
  admin(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/adminAvengers`, payload);
  }
  getDeposit() {
    return this.http.get<any>(`${this.baseUrl}/adminGetDeposits`);
  }
  adminTransactionAvengers(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/adminTransactionAvengers`, payload);
  }
  adminUpdateUserStatus(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/adminUpdateUserStatus`, payload);
  }
  adminWithdrawFilter(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/adminWithdrawFilter`, payload);
  }
  adminWithdrawConfirm(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/withdraw-approval`, payload);
  }
  sendBulkEmails(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/send-bulk-emails`, payload);
  }
  //Game Apis
  purchaseNow(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/purchaseNow`, payload);
  }
  activateGame(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/activateGame`, payload);
  }

  updatePasscode(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/adminUpdatePasscode`, payload);
  }

  getMasterData() {
    return this.http.get<any>(`${this.baseUrl}/getAdminData`);
  }

  updateMasterData(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/adminUpdate`, payload);
  }

  getPassword(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/getpassword`, payload);
  }

  transfer(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/convert-earnings`, payload);
  }

}
