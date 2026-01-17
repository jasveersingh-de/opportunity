/**
 * Mock authentication service for UI prototype
 * This will be replaced with real Supabase auth in Phase 2
 */

export interface MockUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

const MOCK_USER: MockUser = {
  id: "mock-user-1",
  email: "user@example.com",
  name: "John Doe",
  avatar: undefined,
};

export class MockAuthService {
  private static currentUser: MockUser | null = null;

  /**
   * Mock login - simulates LinkedIn OAuth
   */
  async login(): Promise<MockUser> {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    MockAuthService.currentUser = MOCK_USER;
    return MOCK_USER;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<MockUser | null> {
    return MockAuthService.currentUser;
  }

  /**
   * Mock logout
   */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    MockAuthService.currentUser = null;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return MockAuthService.currentUser !== null;
  }
}

export const mockAuthService = new MockAuthService();
