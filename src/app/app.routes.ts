import { Routes } from '@angular/router';

import { Layout } from './layout/layout';
import { Home } from './features/home/home';
import { Position } from './features/position/position';
import { Team } from './features/team/team';
import { Profile } from './features/profile/profile';
import { Game } from './features/game/game';
import { Signin } from './features/signin/signin';
import { Signup } from './features/signup/signup';
import { VerifyEmail } from './features/verify-email/verify-email'
import { EmailConfirmation } from './features/email-confirmation/email-confirmation'
import { Withdrawal } from './features/withdrawal/withdrawal'
import { History } from './features/history/history'
import { Commision } from './features/commision/commision'
import { Members } from './features/members/members'
import { Success } from './features/success/success'
import { ChangePassword } from './features/change-password/change-password'
import { TermsAndConditions } from './features/terms-and-conditions/terms-and-conditions'
import { DepositOxapay } from './features/deposit-oxapay/deposit-oxapay'
import { ForgetPassword } from './features/forget-password/forget-password'
import { Maintainance } from './features/maintainance/maintainance'
import { Adminlayout } from './admin/adminlayout/adminlayout'
import { Dashboard } from './admin/dashboard/dashboard'
import { Users } from './admin/users/users'
import { WithdrawRequest } from './admin/withdraw-request/withdraw-request'
import { WithdrawAccepts } from './admin/withdraw-accepts/withdraw-accepts'
import { WithdrawRejects } from './admin/withdraw-rejects/withdraw-rejects'
import { UserDeposits } from './admin/user-deposits/user-deposits'
import { TeamDetails } from './admin/team-details/team-details'
import { MasterData } from './admin/master-data/master-data'
import { authGuard } from './guards/auth-guard';



export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
   { path: 'signin', component: Signin },
   { path: 'signup', component: Signup },
   { path: 'forget', component: ForgetPassword },
   { path: 'verify-email', component: VerifyEmail },
   { path: 'email-confirm', component: EmailConfirmation },
   { path: 'withdraw', component: Withdrawal },
   { path: 'history', component: History },
   { path: 'commission', component: Commision },
   { path: 'members', component: Members },
   { path: 'change-password', component: ChangePassword },
   { path: 't&c', component: TermsAndConditions },
   { path: 'payment', component: DepositOxapay },
   { path: 'under-maintainance', component: Maintainance },
{
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'rank', component: Position },
      { path: 'tower', component: Game },
      { path: 'team', component: Team },
      { path: 'profile', component: Profile },
      { path: 'success', component: Success },
      
    ],
  },
  {
  path: 'admin',
  component: Adminlayout,
  canActivate: [authGuard],
  children: [
    { path: 'dashboard', component: Dashboard },
    { path: 'users', component: Users },
    { path: 'withdrawl-requests', component: WithdrawRequest },
    { path: 'withdrawl-accepts', component: WithdrawAccepts },
    { path: 'withdrawl-rejects', component: WithdrawRejects },
    { path: 'master-data', component: MasterData },
    { path: 'deposits', component: UserDeposits },
    { path: 'teams', component: TeamDetails },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // default route
  ]
},
  { path: '**', redirectTo: '' },
];
