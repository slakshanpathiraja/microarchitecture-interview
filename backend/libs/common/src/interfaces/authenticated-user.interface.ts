export class AuthenticatedUser {
  sub: string; // The user ID
  email: string; // The user email
  role: string; // The user role (e.g., 'administrator', 'manager', 'general_user')
}
