import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const ADMIN_EMAILS = ["vincentjhon7826@gmail.com"];

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("email");

  const isAdminRoute = state.url.startsWith("/admin");

  // 🔹 First, make sure user is logged in (email required)
  if (!userEmail || userEmail.trim() === "") {
    router.navigate(['/signin']);
    return false;
  }

  // 🔹 For NON-ADMIN ROUTES → userId REQUIRED
  if (!isAdminRoute) {
    if (!userId || userId.trim() === "") {
      router.navigate(['/signin']);
      return false;
    }
    return true; // normal pages ok
  }

  // 🔹 For ADMIN ROUTES → only admin email check
  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  if (!isAdmin) {
    router.navigate(['/home']); // normal user → block admin
    return false;
  }

  return true; // admin allowed even if userId missing
};
