import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookReader from '../BookReader';
import { useGameStore } from '@/stores/useGameStore';

jest.mock('@/stores/useGameStore');

const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

const mockBook = {
  id: 'book-ai-ecosystem',
  title: 'The Collective Intelligence Stack',
  description: 'A 450+ agent AI ecosystem spanning 15 departments',
  category: 'project' as const,
  content: 'An autonomous multi-agent system orchestrating specialized AI agents.',
  url: '#',
  icon: '🧠',
  color: '#00f0ff',
  discovered: true,
};

describe('BookReader Component', () => {
  const mockSetActiveBook = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when no active book', () => {
    mockUseGameStore.mockReturnValue({
      activeBook: null,
      setActiveBook: mockSetActiveBook,
    } as any);

    const { container } = render(<BookReader />);
    expect(container.firstChild).toBeNull();
  });

  it('should render book details when active book exists', () => {
    mockUseGameStore.mockReturnValue({
      activeBook: mockBook,
      setActiveBook: mockSetActiveBook,
    } as any);

    render(<BookReader />);

    expect(screen.getByText('[project]')).toBeInTheDocument();
    expect(screen.getByText('The Collective Intelligence Stack')).toBeInTheDocument();
    expect(screen.getByText('A 450+ agent AI ecosystem spanning 15 departments')).toBeInTheDocument();
    expect(screen.getByText(/An autonomous multi-agent system/)).toBeInTheDocument();
  });

  it('should display book icon', () => {
    mockUseGameStore.mockReturnValue({
      activeBook: mockBook,
      setActiveBook: mockSetActiveBook,
    } as any);

    render(<BookReader />);

    expect(screen.getByText('🧠')).toBeInTheDocument();
  });

  it('should display category tag', () => {
    mockUseGameStore.mockReturnValue({
      activeBook: { ...mockBook, category: 'skill' as const },
      setActiveBook: mockSetActiveBook,
    } as any);

    render(<BookReader />);

    expect(screen.getByText('[skill]')).toBeInTheDocument();
  });

  it('should display close hint', () => {
    mockUseGameStore.mockReturnValue({
      activeBook: mockBook,
      setActiveBook: mockSetActiveBook,
    } as any);

    render(<BookReader />);

    expect(screen.getByText(/CLICK OUTSIDE OR PRESS ESC TO CLOSE/)).toBeInTheDocument();
  });

  it('should call setActiveBook(null) when clicking overlay', () => {
    mockUseGameStore.mockReturnValue({
      activeBook: mockBook,
      setActiveBook: mockSetActiveBook,
    } as any);

    const { container } = render(<BookReader />);
    const overlay = container.firstChild as HTMLElement;

    fireEvent.click(overlay);

    expect(mockSetActiveBook).toHaveBeenCalledWith(null);
  });

  it('should not call setActiveBook when clicking book content', () => {
    mockUseGameStore.mockReturnValue({
      activeBook: mockBook,
      setActiveBook: mockSetActiveBook,
    } as any);

    render(<BookReader />);
    const bookContent = screen.getByText('The Collective Intelligence Stack').closest('div');

    if (bookContent) {
      fireEvent.click(bookContent);
    }

    // Should not have been called because stopPropagation prevents it
    expect(mockSetActiveBook).not.toHaveBeenCalled();
  });

  it('should render different book categories correctly', () => {
    const categories: Array<'project' | 'skill' | 'achievement' | 'lore'> = [
      'project',
      'skill',
      'achievement',
      'lore',
    ];

    categories.forEach(category => {
      mockUseGameStore.mockReturnValue({
        activeBook: { ...mockBook, category },
        setActiveBook: mockSetActiveBook,
      } as any);

      const { unmount } = render(<BookReader />);
      expect(screen.getByText(`[${category}]`)).toBeInTheDocument();
      unmount();
    });
  });

  it('should display full content text', () => {
    const longContent = 'This is a very long content text that should be displayed in full';
    mockUseGameStore.mockReturnValue({
      activeBook: { ...mockBook, content: longContent },
      setActiveBook: mockSetActiveBook,
    } as any);

    render(<BookReader />);

    expect(screen.getByText(longContent)).toBeInTheDocument();
  });
});
