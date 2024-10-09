'use client'
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { DotsIcon } from '@/constants'
import { cn } from '@/lib'

// Define the props for managing links
interface LinksInputProps {
  className?: string;
  formlinks: { url: string, title: string }[];
  updateFormLinks: (formlinks:{ url: string, title: string }[]) => void;
}

export default function LinksInput({ className, formlinks, updateFormLinks }: LinksInputProps) {
    const [links, setLinks] = React.useState(
        formlinks || [{title: '', url: ""},{title: '', url: ""}]
    )

  // Handler to add a new empty link
  const addLink = () => {
    setLinks(prev => [...prev, { url: '', title: '' }])
  }

  // Handler to update a specific link
  const updateLink = (index: number, field: 'url' | 'title', value: string) => {
    const updatedLinks = [...links]
    updatedLinks[index][field] = value
    setLinks(updatedLinks)
    updateFormLinks(updatedLinks)
  }

  // Handler to remove a link by its index
  const removeLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index)
    setLinks(updatedLinks)
  }

  return (
    <section className="space-y-4">
      <div className={cn(`flex flex-col gap-4 w-full`, className)}>
        {links?.map((link, idx) => (
          <CardWithForm
            key={idx}
            link={link}
            index={idx}
            onUpdate={updateLink}
            onRemove={removeLink}
          />
        ))}
      </div>
      <div className="w-full">
        <button
          type="button"
          className="bg-basePrimary text-white px-3 py-1 rounded-md"
          onClick={addLink}
        >
          Add link +
        </button>
      </div>
    </section>
  )
}

// Props for the CardWithForm component
interface CardWithFormProps {
  link: { url: string, title: string };
  index: number;
  onUpdate: (index: number, field: 'url' | 'title', value: string) => void;
  onRemove: (index: number) => void;
}

// Component for each individual link input form
export function CardWithForm({ link, index, onUpdate, onRemove }: CardWithFormProps) {
  return (
    <div className="w-full border rounded-md bg-baseBg p-4 pr-3">
      <div className="flex gap-1 items-center">
        <div className="space-y-2 w-full">
          <Input
            id={`linktitle-${index}`}
            placeholder="Link title e.g. LinkedIn"
            value={link.title}
            onChange={(e) => onUpdate(index, 'title', e.target.value)}
            className="bg-baseBg focus-within:bg-baseBg focus:bg-baseBg focus:outline-none focus:ring-0 border w-full"
          />
          <Input
            id={`linkurl-${index}`}
            placeholder="Link URL"
            value={link.url}
            onChange={(e) => onUpdate(index, 'url', e.target.value)}
            className="bg-baseBg focus-within:bg-baseBg focus:bg-baseBg focus:outline-none focus:ring-0 border w-full"
          />
        </div>
        <button className="shrink-0" onClick={() => onRemove(index)}>
          <DotsIcon />
        </button>
      </div>
    </div>
  )
}
