import { useState, useRef, useEffect } from "react";
import { Languages } from "lucide-react";
function Dropdown({ options, onSelect, placeholder = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option) {
    setSelected(option);
    setIsOpen(false);
    onSelect(option);
  }

  return (
    <div ref={ref} className="relative inline-block cursor-pointer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[20px] text-left flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
      >
        <Languages />
        <span>{selected ? (selected.label ?? selected) : placeholder}</span>
      </button>

      {isOpen && (
        <ul
          className="absolute top-full right-0 min-w-[160px] max-h-60 overflow-y-auto
                     bg-white border border-gray-300 rounded-md shadow-lg
                     list-none p-1 m-0 z-10"
        >
          {options.map((option, index) => (
            <li key={option.value ?? option.id ?? index}>
              <button
                onClick={() => handleSelect(option)}
                className="block w-full text-left px-3 py-2 rounded bg-transparent
                           border-none cursor-pointer hover:bg-gray-100"
              >
                {option.label ?? option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
