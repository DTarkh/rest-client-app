import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '../dropdown-menu';

// Radix portals attach to body by default; minimal smoke interaction via open prop

describe('DropdownMenu primitives', () => {
  it('renders content via controlled open', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>Section</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem inset>Item A</DropdownMenuItem>
            <DropdownMenuItem variant='destructive'>Item B</DropdownMenuItem>
            <DropdownMenuCheckboxItem checked>Check 1</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Check 2</DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup value='r1'>
              <DropdownMenuRadioItem value='r1'>Radio 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='r2'>Radio 2</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger inset>More</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            With Shortcut <DropdownMenuShortcut>Ctrl+K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
    expect(screen.getByText('Check 1')).toBeInTheDocument();
    expect(screen.getByText('Radio 1')).toBeInTheDocument();
    expect(screen.getByText('Sub Item')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+K')).toBeInTheDocument();
  });
});
