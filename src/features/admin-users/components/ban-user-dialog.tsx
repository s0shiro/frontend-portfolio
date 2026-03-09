import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BanUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  userName: string
  isBanning: boolean
}

export function BanUserDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isBanning,
}: BanUserDialogProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    onConfirm(reason)
    setReason('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ban {userName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to ban this user? They will not be able to sign in anymore.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              placeholder="e.g. Violation of terms"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isBanning}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isBanning}>
            {isBanning ? 'Banning...' : 'Ban User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
