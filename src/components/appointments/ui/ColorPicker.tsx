import React, { useState, useRef, useEffect, FC } from 'react';

// Define the colors array
const colors: string[] = [
    // Shades of Red
    '#FF0000', '#FF6347', '#FF4500', '#FF7F50', '#DC143C', '#FF69B4', '#FF1493', '#C71585', '#DB7093', '#E9967A',
    // Shades of Blue
    '#0000FF', '#1E90FF', '#4169E1', '#6495ED', '#00BFFF', '#87CEEB', '#87CEFA', '#4682B4', '#6A5ACD', '#7B68EE',
    // Shades of Green
    '#008000', '#3CB371', '#2E8B57', '#32CD32', '#00FF00', '#9ACD32', '#6B8E23', '#ADFF2F', '#7FFF00', '#00FA9A',
    // Shades of Yellow
    '#FFFF00', '#FFD700', '#FFA500', '#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#FF00FF', '#EE82EE', '#DA70D6',
    // Shades of Purple
    '#800080', '#8A2BE2', '#9370DB', '#4B0082', '#483D8B', '#6A0DAD', '#BA55D3', '#9932CC', '#8B008B', '#9400D3',
    // Shades of Orange
    '#FFA500', '#FF8C00', '#FF4500', '#FF6347', '#FF7F50', '#FFD700', '#FF8C00', '#D2691E', '#CD5C5C', '#FF4500',
    // Shades of Teal/Cyan
    '#008080', '#00CED1', '#20B2AA', '#008B8B', '#5F9EA0', '#00FFFF', '#00CED1', '#40E0D0', '#00FFFF', '#00CED1',
    // Shades of Gray
    '#808080', '#696969', '#A9A9A9', '#708090', '#778899', '#B0C4DE', '#D3D3D3', '#DCDCDC', '#F5F5F5', '#FFFFFF',
  ];
  
  
// Define the props type for ColorPicker if needed
interface ColorPickerProps {
  onChange?: (color: string) => void;
  position?: 'right'|'left';
  initialColor?: string;
}

const ColorPicker: FC<ColorPickerProps> = ({ onChange, position, initialColor }) => {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor || '#0000FF');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to handle color selection
  const selectColor = (color: string) => {
    setSelectedColor(color);
    // setCustomColor(color);
    setIsOpen(false);
    if (onChange) {
      onChange(color);
    }
  };

  const selectCustomColor = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
    // setIsOpen(false);
    if (onChange) {
      onChange(color);
    }
  };

  // Handle click outside to close the dropdown
  useEffect(() => {
    if(initialColor) setSelectedColor(initialColor)

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef,initialColor]);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={` w-10 h-10  rounded cursor-pointer`}
        style={{ backgroundColor: selectedColor }}
      ></div>
      {isOpen && (
        <div className={`absolute top-full ${position==='right'?'right-0':'left-0'} z-30 w-60 bg-white border rounded shadow-md transition-all `}>
          <div className="grid grid-cols-8 gap-2 p-2">
            {colors.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => selectColor(color)}
              />
            ))}
          </div>
          <div className="p-2">
          <input
              type="text"
              value={customColor}
              onChange={(e) => selectCustomColor(e.target.value)}
              onBlur={() => /^#[0-9A-F]{6}$/i.test(customColor) && selectCustomColor(customColor)}
              placeholder="#hexvalue"
              className="w-full border rounded p-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
