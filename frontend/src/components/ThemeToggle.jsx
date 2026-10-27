import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`relative flex items-center w-16 h-8 rounded-full p-1 cursor-pointer border transition-colors duration-300 ${
        isDark
          ? "bg-slate-700 border-slate-600"
          : "bg-primary/10 border-primary/30"
      } ${className}`}
    >
      {/* Icons */}
      <span className="absolute inset-0 flex items-center justify-between px-2 text-xs pointer-events-none">
        <FontAwesomeIcon
          icon={faSun}
          className={`transition-opacity duration-300 ${
            isDark ? "opacity-30 text-yellow-300" : "opacity-100 text-secondary"
          }`}
        />
        <FontAwesomeIcon
          icon={faMoon}
          className={`transition-opacity duration-300 ${
            isDark ? "opacity-100 text-yellow-200" : "opacity-30 text-primary"
          }`}
        />
      </span>

      {/* Sliding knob */}
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`relative z-10 w-6 h-6 rounded-full shadow-md ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
        style={{ marginInlineStart: isDark ? "auto" : 0 }}
      />
    </button>
  );
}
