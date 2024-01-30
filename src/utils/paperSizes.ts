type TPaperType = {
  value: {
    width: number;
    height: number;
  };
  label: string;
};

export const PAPER_SIZES: TPaperType[] = [
  {
    value: {
      width: 21.59,
      height: 27.94,
    },
    label: "letter",
  },
  {
    value: {
      width: 27.94,
      height: 43.18,
    },
    label: "tabloid",
  },
  {
    value: {
      width: 21.59,
      height: 35.56,
    },
    label: "legal",
  },
  {
    value: {
      width: 13.97,
      height: 21.59,
    },
    label: "statement",
  },
  {
    value: {
      width: 18.42,
      height: 26.67,
    },
    label: "executive",
  },
  {
    value: {
      width: 29.7,
      height: 42,
    },
    label: "A3",
  },
  {
    value: {
      width: 21,
      height: 29.7,
    },
    label: "A4",
  },
  {
    value: {
      width: 14.8,
      height: 21,
    },
    label: "A5",
  },
  {
    value: {
      width: 25.7,
      height: 36.4,
    },
    label: "B4",
  },
  {
    value: {
      width: 18.2,
      height: 25.7,
    },
    label: "B5",
  },
];
