import { BrowserRouter, Routes, Route } from "react-router-dom"
import GroupsPage from "./pages/GroupsPage"
import GroupDetailPage from "./pages/GroupDetailPage"
import UsersPage from "./pages/UsersPage"



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GroupsPage />} />
                <Route path="/groups/:id" element={<GroupDetailPage />} />
                <Route path="/users" element={<UsersPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App