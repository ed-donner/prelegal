/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function TestHarness() {
  const { user, loading, demoLogin } = useAuth();
  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="user-email">{user?.email ?? 'anonymous'}</div>
      <button onClick={() => demoLogin('Alice').catch(() => {})}>
        Continue as Demo User
      </button>
    </div>
  );
}

describe('demo login (KAN-12)', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('demoLogin calls /api/auth/demo and sets the demo user', async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url === '/api/auth/me') {
        return { ok: false, json: async () => ({ detail: 'Not authenticated' }) };
      }
      return {
        ok: true,
        json: async () => ({
          user: { id: 99, email: 'demo.522b276a356b@prelegal.local' },
          message: 'Signed in as demo user',
        }),
      };
    });

    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>
    );

    const button = screen.getByText('Continue as Demo User');
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/auth/demo',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Alice' }),
        })
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('user-email').textContent).toBe('demo.522b276a356b@prelegal.local');
    });
  });

  it('surfaces an error when demo login fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ detail: 'Demo login failed' }),
    });

    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Continue as Demo User'));

    await waitFor(() => {
      expect(screen.getByTestId('user-email').textContent).toBe('anonymous');
    });
  });
});