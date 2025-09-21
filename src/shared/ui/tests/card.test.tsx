import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '../card';

describe('Card compound component', () => {
  it('renders structure', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction>Action</CardAction>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(container.querySelector('[data-slot="card" ]')).toBeTruthy();
    expect(container.textContent).toContain('Title');
    expect(container.textContent).toContain('Content');
    expect(container.textContent).toContain('Footer');
  });
});
