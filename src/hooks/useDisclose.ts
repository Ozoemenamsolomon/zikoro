import { useState } from "react";

const useDisclose = () => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen((prevOpen) => !prevOpen);

  return { open, toggleOpen };
};
