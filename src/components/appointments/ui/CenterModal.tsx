import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import { cn } from "@/lib"
import { useState } from "react"

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


// export function CenterModall({children, trigger, className}:{className?:string, trigger:React.ReactNode, children:React.ReactNode}) {
//   const [show, setShow] = useState(false)
//   return (
//     <>
//       <div className="" onClick={()=>setShow(true)}>
//         {trigger}
//       </div>
//       <section onClick={()=>setShow(false)} className={`${ show ? '' : 'hidden' } fixed z-50 bg-black/5 inset-0 flex justify-center items-center`}>
//         <div onClick={e=>e.stopPropagation()} className="relative ">
//           <button className="absolute right-6 top-6">x</button>
//           {children}
//         </div>
//       </section>
//     </>
//   )
// }
