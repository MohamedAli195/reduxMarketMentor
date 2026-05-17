import * as Dialog from '@radix-ui/react-dialog';
import { Box, IconButton, Typography } from '@mui/material';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

const overlaySx = {
  position: 'fixed',
  inset: 0,
  bgcolor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1300,
  animation: 'radix-dialog-overlay-in 0.15s ease-out',
  '@keyframes radix-dialog-overlay-in': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};

const contentSx = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: 480,
  maxHeight: '85vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 2.5,
  zIndex: 1301,
  animation: 'radix-dialog-content-in 0.2s ease-out',
  '@keyframes radix-dialog-content-in': {
    from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
    to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  },
};

export interface RadixDialogProps {
  /** Controlled open state */
  open: boolean;
  /** Called when open state should change (e.g. close button, overlay click, escape) */
  onOpenChange: (open: boolean) => void;
  /** Dialog content */
  children: ReactNode;
  /** Optional title (used for accessibility and optionally displayed) */
  title?: string;
  /** Optional description (used for accessibility) */
  description?: string;
  /** Optional trigger element; when provided, clicking it opens the dialog */
  trigger?: ReactNode;
  /** Show close (X) button in the corner. Default true */
  showCloseButton?: boolean;
}

/**
 * Dialog built with Radix UI primitives (@radix-ui/react-dialog), styled with MUI.
 * Accessible (focus trap, escape to close, aria title/description).
 * Use open + onOpenChange for controlled usage.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/dialog
 */
export default function RadixDialog({
  open,
  onOpenChange,
  children,
  title,
  description,
  trigger,
  showCloseButton = true,
}: RadixDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      {trigger != null && (
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Box sx={overlaySx} />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <Box sx={contentSx} role="dialog" aria-modal="true">
            {title != null && (
              <Dialog.Title asChild>
                <Typography component="span" variant="h6" sx={{ pr: showCloseButton ? 5 : 0 }}>
                  {title}
                </Typography>
              </Dialog.Title>
            )}
            {description != null && (
              <Dialog.Description asChild>
                <Typography component="span" variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {description}
                </Typography>
              </Dialog.Description>
            )}
            <Box sx={{ mt: title != null || description != null ? 2 : 0 }}>{children}</Box>
            {showCloseButton && (
              <Dialog.Close asChild>
                <IconButton
                  aria-label="Close"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                  }}
                >
                  <X size={18} />
                </IconButton>
              </Dialog.Close>
            )}
          </Box>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
