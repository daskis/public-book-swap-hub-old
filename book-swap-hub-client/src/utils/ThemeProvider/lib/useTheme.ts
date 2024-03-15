import {LOCAL_STORAGE_THEME_KEY, Theme, ThemeContent} from "./ThemeContent";
import {useContext} from "react";

interface UseThemeResult {
    toggleTheme: () => void;
    theme: Theme;
}

export function useTheme() : UseThemeResult {
    const {theme, setTheme} = useContext(ThemeContent);
    const toggleTheme = () => {
        const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
        if (setTheme) {
            setTheme(newTheme);
        }
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
    };
    return <UseThemeResult>{theme, toggleTheme};
}