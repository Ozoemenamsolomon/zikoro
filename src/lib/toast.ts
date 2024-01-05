import { ToasterProps } from "react-hot-toast";

// To render notifications. I saw a customized toaster in the previous PR
// But i added this package to optimize performance and improve scalability
export const TOASTER_PROPS: ToasterProps = {
	position: "top-right",
	toastOptions: {
		style: {
			fontSize: "0.875rem",
		},
		duration: 4000,
		success: {
			style: {
				backgroundColor: "#DCFCE7",
				color: "#14532D",
			},
		},
	},
};
