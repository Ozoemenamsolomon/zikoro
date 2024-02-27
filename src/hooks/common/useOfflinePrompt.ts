"use client";

import { toast } from "react-hot-toast";
import { useInterval } from ".";

export const useOfflinePrompt = (): void => {
	useInterval(() => {
		// check online status
		const onLine = window?.navigator?.onLine;

		if (!onLine) {
			toast.error("Opps! No internet connection! ");
		}
	}, 5000);
};
