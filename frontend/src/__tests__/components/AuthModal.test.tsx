import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@/contexts/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

function makeAuthMock(overrides: Partial<ReturnType<typeof useAuth>> = {}) {
  return {
    user: null,
    loading: false,
    signin: jest.fn(),
    signup: jest.fn(),
    signout: jest.fn(),
    refreshUser: jest.fn(),
    ...overrides,
  };
}

describe('AuthModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockUseAuth.mockReturnValue(makeAuthMock());
  });

  it('renders sign in mode by default', () => {
    render(<AuthModal onClose={mockOnClose} />);
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('switches to sign up mode when tab clicked', async () => {
    const user = userEvent.setup();
    render(<AuthModal onClose={mockOnClose} />);
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('switches back to sign in via bottom link', async () => {
    const user = userEvent.setup();
    render(<AuthModal onClose={mockOnClose} />);
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(<AuthModal onClose={mockOnClose} />);
    await user.click(screen.getByRole('button', { name: '×' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key pressed', () => {
    render(<AuthModal onClose={mockOnClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls signin and closes on successful sign in', async () => {
    const mockSignin = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(makeAuthMock({ signin: mockSignin }));
    const user = userEvent.setup();

    render(<AuthModal onClose={mockOnClose} />);
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Your password'), 'password123');
    // Use the submit button specifically (last of the two "Sign In" buttons)
    const submitBtn = screen.getAllByRole('button', { name: 'Sign In' }).at(-1)!;
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('calls signup and closes on successful sign up', async () => {
    const mockSignup = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(makeAuthMock({ signup: mockSignup }));
    const user = userEvent.setup();

    render(<AuthModal onClose={mockOnClose} />);
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    await user.type(screen.getByPlaceholderText('you@example.com'), 'new@example.com');
    await user.type(screen.getByPlaceholderText('At least 8 characters'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('new@example.com', 'password123');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('displays error message on signin failure', async () => {
    const mockSignin = jest.fn().mockRejectedValue(new Error('Invalid email or password'));
    mockUseAuth.mockReturnValue(makeAuthMock({ signin: mockSignin }));
    const user = userEvent.setup();

    render(<AuthModal onClose={mockOnClose} />);
    await user.type(screen.getByPlaceholderText('you@example.com'), 'bad@example.com');
    await user.type(screen.getByPlaceholderText('Your password'), 'wrongpass');
    const submitBtn = screen.getAllByRole('button', { name: 'Sign In' }).at(-1)!;
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('clears error when switching modes', async () => {
    const mockSignin = jest.fn().mockRejectedValue(new Error('Auth failed'));
    mockUseAuth.mockReturnValue(makeAuthMock({ signin: mockSignin }));
    const user = userEvent.setup();

    render(<AuthModal onClose={mockOnClose} />);
    await user.type(screen.getByPlaceholderText('you@example.com'), 'x@x.com');
    await user.type(screen.getByPlaceholderText('Your password'), 'password123');
    const submitBtn = screen.getAllByRole('button', { name: 'Sign In' }).at(-1)!;
    await user.click(submitBtn);
    await waitFor(() => expect(screen.getByText('Auth failed')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.queryByText('Auth failed')).not.toBeInTheDocument();
  });

  it('disables submit button while loading', async () => {
    // Never resolves so loading stays true
    const mockSignin = jest.fn().mockReturnValue(new Promise(() => {}));
    mockUseAuth.mockReturnValue(makeAuthMock({ signin: mockSignin }));
    const user = userEvent.setup();

    render(<AuthModal onClose={mockOnClose} />);
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Your password'), 'password123');
    const submitBtn = screen.getAllByRole('button', { name: 'Sign In' }).at(-1)!;
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Please wait...' })).toBeDisabled();
    });
  });
});
