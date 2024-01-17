import { Metadata } from "next";

export const metaGenerator = async (): Promise<Metadata> => {
	return {
		title: `Published Events`,
		description: "Lists of the active and inactive event",
	};
};

