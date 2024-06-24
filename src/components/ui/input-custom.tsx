"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {label?:string, error?:string,}

export const InputCustom = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label,error, type, ...props }, ref) => {
    return (
      <>
        {label && <label htmlFor={props?.name} ><p className="pb-1">{label}</p ></label>}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
      />
        {error && <small className="text-red-600 pt-1">{error}</small>}
      </>
    )
  }
)

