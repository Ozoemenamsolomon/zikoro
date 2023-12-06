'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home } from '@styled-icons/typicons/Home';
import { MoneyDollarBox } from 'styled-icons/remix-fill';
import { MegaphoneLoud } from '@styled-icons/fluentui-system-filled/MegaphoneLoud';
import { PaperPlane } from 'styled-icons/fa-regular';
import { Cog } from 'styled-icons/heroicons-outline';

const links = [
	{
		name: 'Home',
		icon: Home,
		href: '/',
	},
	{
		name: 'Billing',
		icon: MoneyDollarBox,
		href: '/projects',
	},
	{
		name: 'Marketing',
		icon: MegaphoneLoud,
		href: '/about',
	},
	{
		name: 'Published Events',
		icon: PaperPlane,
		href: '/contact',
	},
	{
		name: 'Settings',
		icon: Cog,
		href: '/contact',
	},
];
const Sidebar = () => {
	return (
		<div className="h-full w-[300px] bg-white flex-col flex justify-between">
			<div>
				<Image className="p-4" src={''} alt={''}>
					Logo
				</Image>
				<NavLinks></NavLinks>
			</div>
			<UserActions></UserActions>
		</div>
	);
};

export default Sidebar;

const NavLinks = () => {
	return (
		<div className="flex flex-col">
			{links.map(({ href, name, icon: Icon }) => {
				return (
					<Link href={href} className="p-4">
						{Icon && <Icon className="w-6 h-6 mr-2" />}
						{name}
					</Link>
				);
			})}
		</div>
	);
};

const UserActions = () => {
	return (
		<div className="flex flex-col">
			<div className="p-4">UserActions</div>
		</div>
	);
};
