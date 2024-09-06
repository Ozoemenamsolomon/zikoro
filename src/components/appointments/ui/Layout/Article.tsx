import React from 'react'
import { cn } from '@/lib'

interface ArticleProp {
  className?:string,
  children: React.ReactNode
}

const Article:React.FC<ArticleProp> = ({className, children}) => {
  return (
    <article className={cn("",className)}>
      {children}
    </article>
  )
}

export default Article