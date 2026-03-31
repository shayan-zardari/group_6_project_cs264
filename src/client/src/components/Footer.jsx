import "../index.css"

export default function Footer({ onPageChange }) {
    return (
        <footer>
            <div>

                <div className="footer-left">
                    <h2 className="logo">Task Scheduler</h2>
                    <p>Plan smarter. Achieve faster.</p>
                </div>

                <div className="footer-center">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange("home");
                      }}
                    >
                      Home
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange("home");
                      }}
                    >
                      Tasks
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange("calendar");
                      }}
                    >
                      Calendar
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange("about");
                      }}
                    >
                      About
                    </a>
                </div>

                <div className="footer-right">
                    <p id="copyright"></p>
                </div>

            </div>
        </footer>
    )
}