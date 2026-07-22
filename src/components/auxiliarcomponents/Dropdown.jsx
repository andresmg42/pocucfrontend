import { useState, useRef, useEffect } from "react";

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
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ minWidth: "20px", textAlign: "left" }}
      >
        {selected ? (selected.label ?? selected) : placeholder}{" "}
        {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "white",
            border: "1px solid #ccc",
            listStyle: "none",
            padding: "4px 0",
            margin: 0,
            minWidth: "160px",
            zIndex: 10,
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {options.map((option, index) => (
            <li key={option.value ?? option.id ?? index}>
              <button
                onClick={() => handleSelect(option)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
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
