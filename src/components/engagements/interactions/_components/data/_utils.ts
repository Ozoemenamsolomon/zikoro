interface SelectType {
  value:string;
  label:string;
}

export let duration: SelectType[] = [];

for (let i = 10; i <=90; i += 5) {
  duration.push({ value: `${i.toString()}00`, label: `${i} seconds` });
}


export let points: SelectType[] = [];

for (let i = 10; i <= 1000; i += 10) {
  points.push({ value: i.toString(), label: `${i} points` });
}



