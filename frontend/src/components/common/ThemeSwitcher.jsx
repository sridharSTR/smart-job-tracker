import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeSwitcher() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button className="icon-btn" type="button" onClick={toggleTheme} title="Toggle theme">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

