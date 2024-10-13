'use client';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { DotsIcon } from '@/constants';
import { cn } from '@/lib';

// Updated interface for managing links
interface LinksInputProps {
  className?: string;
  formlinks: { url: string; title: string }[] | null;
  updateFormLinks: (formlinks: { url: string; title: string }[] | null) => void;
}

export default function LinksInput({ className, formlinks, updateFormLinks }: LinksInputProps) {
  const [links, setLinks] = React.useState<{ url: string; title: string }[]>(
    Array.isArray(formlinks) ?
    formlinks : [{ url: '', title: '' }]   
  );

  // Handler to add a new empty link
  const addLink = () => {
    setLinks(prev => [...prev, { url: '', title: '' }]);
  };

  // Handler to update a specific link by index
  const updateLink = (index: number, field: 'title' | 'url', value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setLinks(updatedLinks);
    updateFormLinks(updatedLinks);
  };

  // Handler to remove a link by index
  const removeLink = (index: number) => {
    const updatedLinks = links.filter((_, idx) => idx !== index);
    setLinks(updatedLinks);
    updateFormLinks(updatedLinks);
  };

  return (
    <section className="space-y-4">
      <div className={cn(`flex flex-col gap-4 w-full`, className)}>
        {links.map((link, idx) => (
          <CardWithForm
            key={idx}
            index={idx}
            link={link}
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
  );
}

// Props for the CardWithForm component
interface CardWithFormProps {
  index: number;
  link: { url: string; title: string };
  onUpdate: (index: number, field: 'title' | 'url', value: string) => void;
  onRemove: (index: number) => void;
}

export function CardWithForm({ index, link, onUpdate, onRemove }: CardWithFormProps) {
  return (
    <div className="w-full border rounded-md bg-baseBg p-4 pr-3">
      <div className="flex gap-1 items-center">
        <div className="space-y-2 w-full">
          <Input
            placeholder="Link title e.g. LinkedIn"
            value={link.title}
            onChange={(e) => onUpdate(index, 'title', e.target.value)}
            className="bg-baseBg focus-within:bg-baseBg focus:bg-baseBg focus:outline-none focus:ring-0 border w-full"
          />
          <Input
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
  );
}




// 'use client';
// import * as React from 'react';
// import { Input } from '@/components/ui/input';
// import { DotsIcon } from '@/constants';
// import { cn } from '@/lib';

// // Define the props for managing links
// interface LinksInputProps {
//   className?: string;
//   formlinks: Record<string, string> | null;
//   updateFormLinks: (formlinks: Record<string, string>) => void;
// }

// export default function LinksInput({ className, formlinks, updateFormLinks }: LinksInputProps) {
//   const [links, setLinks] = React.useState<Record<string, string>>(
//     formlinks || { [Date.now()]: '' }  // Start with one default entry
//   );

//   // Handler to add a new empty link with a unique key
//   const addLink = () => {
//     setLinks(prev => ({ ...prev, [Date.now()]: '' }));
//   };

//   // Handler to update a specific link's title or value
//   const updateLink = (key: string, value: string, isTitle: boolean = false) => {
//     const updatedLinks = { ...links };
//     if (isTitle) {
//       // For title update (key replacement)
//       const newKey = value || key;
//       updatedLinks[newKey] = updatedLinks[key];
//       delete updatedLinks[key];
//     } else {
//       // For value (URL) update
//       updatedLinks[key] = value;
//     }
//     setLinks(updatedLinks);
//     updateFormLinks(updatedLinks);
//   };

//   // Handler to remove a link by its key
//   const removeLink = (key: string) => {
//     const { [key]: _, ...updatedLinks } = links;  // Safely remove the link
//     setLinks(updatedLinks);
//     updateFormLinks(updatedLinks);
//   };

//   return (
//     <section className="space-y-4">
//       <div className={cn(`flex flex-col gap-4 w-full`, className)}>
//         {Object.entries(links).map(([key, value]) => (
//           <CardWithForm
//             key={key}
//             linkKey={key}
//             linkValue={value}
//             onUpdate={updateLink}
//             onRemove={removeLink}
//           />
//         ))}
//       </div>
//       <div className="w-full">
//         <button
//           type="button"
//           className="bg-basePrimary text-white px-3 py-1 rounded-md"
//           onClick={addLink}
//         >
//           Add link +
//         </button>
//       </div>
//     </section>
//   );
// }

// // Props for the CardWithForm component
// interface CardWithFormProps {
//   linkKey: string;
//   linkValue: string;
//   onUpdate: (key: string, value: string, isTitle?: boolean) => void;
//   onRemove: (key: string) => void;
// }

// export function CardWithForm({ linkKey, linkValue, onUpdate, onRemove }: CardWithFormProps) {
//   return (
//     <div className="w-full border rounded-md bg-baseBg p-4 pr-3">
//       <div className="flex gap-1 items-center">
//         <div className="space-y-2 w-full">
//           <Input
//             placeholder="Link title e.g. LinkedIn"
//             value={linkKey}
//             onChange={(e) => onUpdate(linkKey, e.target.value, true)}
//             className="bg-baseBg focus-within:bg-baseBg focus:bg-baseBg focus:outline-none focus:ring-0 border w-full"
//           />
//           <Input
//             placeholder="Link URL"
//             value={linkValue}
//             onChange={(e) => onUpdate(linkKey, e.target.value)}
//             className="bg-baseBg focus-within:bg-baseBg focus:bg-baseBg focus:outline-none focus:ring-0 border w-full"
//           />
//         </div>
//         <button className="shrink-0" onClick={() => onRemove(linkKey)}>
//           <DotsIcon />
//         </button>
//       </div>
//     </div>
//   );
// }
