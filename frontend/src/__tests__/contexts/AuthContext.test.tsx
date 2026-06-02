import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Helper component that exercises the context
function TestConsumer() {
  const { user, loading, signin, signup, signout, refreshUser } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{user ? user.email : 'none'}</div>
      <button onClick={() => signin('a@b.com', 'pass')}>signin</button>
      <button onClick={() => signup('a@b.com', 'pass')}>signup</button>
      <button onClick={() => signout()}>signout</button>
      <button onClick={() => refreshUser()}>refresh</button>
    </div>
  );
}

// Captures context functions via ref for direct invocation in tests
function ContextCapture({
  capture,
}: {
  capture: React.MutableRefObject<ReturnType<typeof useAuth> | null>;
}) {
  const auth = useAuth();
  capture.current = auth;
  return null;
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws if useAuth is used outside AuthProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within AuthProvider'
    );
    spy.mockRestore();
  });

  it('starts loading, then resolves when /me returns unauthenticated', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false });

    renderWithProvider();
    expect(screen.getByTestId('loading').textContent).toBe('loading');

    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('ready')
    );
    expect(screen.getByTestId('user').textContent).toBe('none');
  });

  it('populates user when /me returns authenticated user', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, email: 'me@example.com' }),
    });

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId('user').textContent).toBe('me@example.com')
    );
  });

  it('sets user on successful signin', async () => {
    // First call is /me (unauthenticated), second is /signin
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 2, email: 'a@b.com' }, message: 'ok' }),
      });

    const user = userEvent.setup();
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));

    await user.click(screen.getByRole('button', { name: 'signin' }));

    await waitFor(() =>
      expect(screen.getByTestId('user').textContent).toBe('a@b.com')
    );
  });

  it('throws on failed signin', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false }) // /me
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Invalid credentials' }),
      });

    const capture = React.createRef<ReturnType<typeof useAuth> | null>() as React.MutableRefObject<ReturnType<typeof useAuth> | null>;
    capture.current = null;

    render(
      <AuthProvider>
        <ContextCapture capture={capture} />
      </AuthProvider>
    );

    await waitFor(() => capture.current !== null && !capture.current.loading);
    await expect(capture.current!.signin('a@b.com', 'pass')).rejects.toThrow('Invalid credentials');
  });

  it('sets user on successful signup', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false }) // /me
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 3, email: 'a@b.com' }, message: 'ok' }),
      });

    const user = userEvent.setup();
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));

    await user.click(screen.getByRole('button', { name: 'signup' }));

    await waitFor(() =>
      expect(screen.getByTestId('user').textContent).toBe('a@b.com')
    );
  });

  it('clears user on signout', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, email: 'me@example.com' }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // signout

    const user = userEvent.setup();
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId('user').textContent).toBe('me@example.com')
    );

    await user.click(screen.getByRole('button', { name: 'signout' }));

    await waitFor(() =>
      expect(screen.getByTestId('user').textContent).toBe('none')
    );
  });

  it('handles fetch error in refreshUser gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'));

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));
    expect(screen.getByTestId('user').textContent).toBe('none');
  });
});
