export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="tool-btn theme-toggle"
      onClick={onToggle}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙 Dark" : "☀ Light"}
    </button>
  );
}
