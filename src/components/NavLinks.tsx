'use client';

import React from 'react';
import Link from 'next/link';
import { links } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib';

export const NavLinks = () => {
	const pathname = usePathname();
	return (
		<ul className="flex px-2 flex-col gap-y-1 items-start  justify-start w-full">
		{links.map(({ href, name, icon: Icon }) => {
		  return (
			<li key={name} className="w-full">
			  <Link
				href={href}
				className={cn(
				  "p-3 px-4 flex  items-center gap-x-2 w-full",
				  href === pathname &&
					"text-zikoro  bg-zikoro bg-opacity-30 rounded-lg t shadow-xl"
				)}
			  >
				{Icon && <Icon size={24}/>}
				<span>{name}</span>
			  </Link>
			</li>
		  );
		})}
	  </ul>
	);

};
