import {ThemeProvider} from "@/components/theme-provider"
import ThemeToggle from "@/components/theme-toggle.jsx";
import LogViewer from "@/components/LogViewer/LogViewer.jsx";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
            <div className="flex flex-col ">
                <div className="flex justify-end p-4">
                    <ThemeToggle/>
                </div>
                <LogViewer/>
            </div>
        </ThemeProvider>
    )
}

export default App