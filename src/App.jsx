import LogViewer from "@/LogViewer.jsx"
import {ThemeProvider} from "@/components/theme-provider"
import ThemeToggle from "@/components/theme-toggle.jsx";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
            <div className="flex flex-col min-h-screen">
                <div className="flex justify-end p-4">
                    <ThemeToggle/>
                </div>
                <LogViewer/>
            </div>
        </ThemeProvider>
    )
}

export default App