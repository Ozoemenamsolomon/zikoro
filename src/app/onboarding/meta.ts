import { Metadata } from "next";

export const metaGenerator = async (): Promise<Metadata> => {
	return {
		title: `Sign up Page`,
		description: "Description",
	};
};

