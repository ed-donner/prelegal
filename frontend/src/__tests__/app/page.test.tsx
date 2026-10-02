jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn(),
  Document: 'Document',
  Page: 'Page',
  Text: 'Text',
  View: 'View',
  StyleSheet: { create: (styles: unknown) => styles },
}));
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/services/chatApi', () => ({
  getGreeting: jest.fn(),
  sendMessage: jest.fn(),
}));

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import { useAuth } from '@/contexts/AuthContext';
import { getGreeting, sendMessage } from '@/services/chatApi';

const mockUseAuth = useAuth as jest.Mock;
const mockGetGreeting = getGreeting as jest.Mock;
const mockSendMessage = sendMessage as jest.Mock;

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
  mockGetGreeting.mockResolvedValue({ response: 'Hi! What document do you need?' });
});

async function chat(text: string) {
  await userEvent.type(screen.getByPlaceholderText('Type your message...'), text);
  await userEvent.click(screen.getByRole('button', { name: 'Send' }));
}

function headerDownloadButton() {
  return within(screen.getByRole('banner')).getByRole('button', { name: /download pdf/i });
}

describe('Home download buttons', () => {
  it('places a disabled download button directly left of the profile button until ready', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com' },
      loading: false,
      signout: jest.fn(),
    });
    render(<Home />);
    await screen.findByText('Hi! What document do you need?');

    const download = headerDownloadButton();
    expect(download).toBeDisabled();

    const profile = within(screen.getByRole('banner')).getByRole('button', { name: /test@example.com/i });
    const downloadWrapper = download.parentElement!;
    expect(downloadWrapper.nextElementSibling).toContainElement(profile);
  });

  it('enables header and chat download buttons once the document is complete', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, signout: jest.fn() });
    mockSendMessage
      .mockResolvedValueOnce({ response: 'Great, a Mutual NDA. Who are the parties?', documentType: 'mutual_nda', isComplete: false })
      .mockResolvedValueOnce({ response: 'All done!', isComplete: true });

    render(<Home />);
    await screen.findByText('Hi! What document do you need?');

    // Sits directly left of the Sign In button for signed-out users
    expect(headerDownloadButton().parentElement!.nextElementSibling).toHaveTextContent('Sign In');

    await chat('I need an NDA');
    await screen.findByText('Great, a Mutual NDA. Who are the parties?');
    expect(headerDownloadButton()).toBeDisabled();
    expect(screen.getAllByRole('button', { name: /download pdf/i })).toHaveLength(1);

    await chat('Acme and Globex, effective today');
    await screen.findByText('All done!');

    await waitFor(() => expect(headerDownloadButton()).toBeEnabled());
    const buttons = screen.getAllByRole('button', { name: /download pdf/i });
    expect(buttons).toHaveLength(2);
    const chatPanelButton = buttons.find(b => !screen.getByRole('banner').contains(b))!;
    expect(chatPanelButton.closest('div.overflow-hidden')).toHaveTextContent('AI Assistant');
    expect(chatPanelButton).toBeEnabled();
  });

  it('disables the header download again when starting a new document', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, signout: jest.fn() });
    mockSendMessage.mockResolvedValueOnce({ response: 'Done!', documentType: 'pilot', isComplete: true });

    render(<Home />);
    await screen.findByText('Hi! What document do you need?');
    await chat('Pilot agreement please');
    await screen.findByText('Done!');
    await waitFor(() => expect(headerDownloadButton()).toBeEnabled());

    await userEvent.click(screen.getByRole('button', { name: 'New Document' }));
    expect(headerDownloadButton()).toBeDisabled();
    expect(screen.getAllByRole('button', { name: /download pdf/i })).toHaveLength(1);
  });
});
