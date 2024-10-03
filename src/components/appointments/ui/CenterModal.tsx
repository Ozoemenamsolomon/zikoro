import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import { cn } from "@/lib"

export function CenterModal({children, trigger, className}:{className?:string, trigger:React.ReactNode, children:React.ReactNode}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={cn(`p-0`, className)}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
