import { signIn } from '@/services/authService';
import {describe, it} from "node:test";
import expect from "expect";

describe('AuthService', () => {
  it('should sign in user with valid credentials', async () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';

    const user = await signIn(mockEmail, mockPassword);
    expect(user).toHaveProperty('user');
    expect(user.user.email).toBe(mockEmail);
  });

  it('should throw error with invalid credentials', async () => {
    const mockEmail = 'wrong@example.com';
    const mockPassword = 'wrongpassword';

    await expect(signIn(mockEmail, mockPassword)).rejects.toThrow();
  });
});