import { Metadata } from "next";

export const metaGenerator = async (): Promise<Metadata> => {
	return {
		title: `Event Details`,
		description: "Description",
	};
};

