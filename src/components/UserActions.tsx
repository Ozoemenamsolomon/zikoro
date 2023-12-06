'use client';
import React from 'react';
import Image from 'next/image';
import { LogOut } from 'styled-icons/ionicons-outline';
import { PersonFeedback } from 'styled-icons/fluentui-system-filled';

export const UserActions = () => {
	return (
		<div className="flex flex-col gap-4 border-t p-4 border-basebody">
			<div className="flex items-center gap-2">
				<Image
					src={'/b92cf7b1b06acc1b9a0759b6f97724c349488816.webp'}
					alt={'user avatar'}
					width={40}
					height={40}
					className="rounded-full"
				/>
				<p>User Name</p>
			</div>
			<button className="flex gap-2">
				<PersonFeedback className="w-6 h-6" />
				Give feedback
			</button>
			<button className="flex gap-2 text-red-700">
				<LogOut className="w-6 h-6" />
				Log out
			</button>
		</div>
	);
};
