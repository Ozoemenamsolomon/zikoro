"use client";
import { useState } from "react";

const useDisclose = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const onOpen = () => setOpen(true);

  const onClose = () => setOpen(false);

  return { isOpen, onOpen, onClose };
};

export default useDisclose;
