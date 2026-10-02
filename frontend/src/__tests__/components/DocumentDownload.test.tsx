jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn(),
  Document: 'Document',
  Page: 'Page',
  Text: 'Text',
  View: 'View',
  StyleSheet: { create: (styles: unknown) => styles },
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { pdf } from '@react-pdf/renderer';
import { DocumentDownload } from '@/components/DocumentDownload';
import { DocumentType, getDefaultFormData } from '@/types/documents';

const mockPdf = pdf as jest.Mock;

describe('DocumentDownload', () => {
  const formData = {
    ...getDefaultFormData(DocumentType.MUTUAL_NDA),
    effectiveDate: '2026-10-02',
  };
  let clickSpy: jest.SpyInstance;

  beforeEach(() => {
    mockPdf.mockReset();
    clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => clickSpy.mockRestore());

  it('is disabled with an explanation when not ready', () => {
    render(
      <DocumentDownload
        documentType={DocumentType.MUTUAL_NDA}
        formData={formData}
        disabled
        disabledReason="Finish the chat to download your document"
      />
    );
    const button = screen.getByRole('button', { name: /download pdf/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('title', 'Finish the chat to download your document');
  });

  it('is disabled when no document type has been chosen', () => {
    render(<DocumentDownload documentType={null} formData={formData} />);
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeDisabled();
  });

  it('generates and downloads the PDF when clicked', async () => {
    mockPdf.mockReturnValue({ toBlob: jest.fn().mockResolvedValue(new Blob(['pdf'])) });
    render(<DocumentDownload documentType={DocumentType.MUTUAL_NDA} formData={formData} />);

    const button = screen.getByRole('button', { name: /download pdf/i });
    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute('title');
    await userEvent.click(button);

    await waitFor(() => expect(clickSpy).toHaveBeenCalledTimes(1));
    const anchor = clickSpy.mock.instances[0] as HTMLAnchorElement;
    expect(anchor.download).toBe('Mutual-NDA_Party1_Party2_2026-10-02.pdf');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    expect(button).toBeEnabled();
  });

  it('shows an error when PDF generation fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockPdf.mockReturnValue({ toBlob: jest.fn().mockRejectedValue(new Error('boom')) });
    render(<DocumentDownload documentType={DocumentType.PILOT} formData={getDefaultFormData(DocumentType.PILOT)} />);

    await userEvent.click(screen.getByRole('button', { name: /download pdf/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to generate PDF');
    expect(clickSpy).not.toHaveBeenCalled();
  });
});
