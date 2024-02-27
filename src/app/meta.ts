import { Metadata } from "next";

export const metaGenerator = async (): Promise<Metadata> => {
	return {
		title: `Welcome to Zikoro - Homepage`,
		description: "Displaying the available events",
	};
};

