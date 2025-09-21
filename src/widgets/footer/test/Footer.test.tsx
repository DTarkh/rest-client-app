import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React, { ReactNode } from 'react';

vi.mock('../model/i18n', () => ({
  useI18n: () => ({
    t: (k: string) =>
      ({
        footerCopyright: '© 2025 RestClient',
        footerAuthorsLabel: 'Authors:',
        authorAlina: 'Alina',
        authorDavid: 'David',
        footerViewCourse: 'View course',
      })[k] ?? k,
  }),
}));

vi.mock('next/link', () => {
  return {
    default: ({
      href,
      children,
      ...rest
    }: React.PropsWithChildren<
      { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
    >) => (
      <a href={href} {...rest}>
        {children as ReactNode}
      </a>
    ),
  };
});

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

import { Footer } from '../ui/Footer';

beforeEach(() => {
  cleanup();
});

describe('Footer accessibility & links', () => {
  it('renders footer landmark', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders author GitHub links with correct names and attributes', () => {
    render(<Footer />);

    const alina = screen.getByRole('link', { name: 'Alina' });
    expect(alina).toHaveAttribute('href', 'https://github.com/lnrzhkv');
    expect(alina).toHaveAttribute('target', '_blank');
    expect(alina).toHaveAttribute('rel', 'noopener noreferrer');

    const david = screen.getByRole('link', { name: 'David' });
    expect(david).toHaveAttribute('href', 'https://github.com/DTarkh');
    expect(david).toHaveAttribute('target', '_blank');
    expect(david).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders course link with accessible name and attributes', () => {
    render(<Footer />);

    const course = screen.getByRole('link', { name: /view course/i });
    expect(course).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(course).toHaveAttribute('target', '_blank');
    expect(course).toHaveAttribute('rel', 'noopener noreferrer');

    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
  });
});
