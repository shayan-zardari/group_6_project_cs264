import SidebarLayout from "./components/SidebarLayout";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CalendarGrid from "./components/CalenderGrid";

export default function App() {
  return (
    <>
    <Navbar/>
    <SidebarLayout/>
    <CalendarGrid/>
    <Footer/>
    </>
  );
}