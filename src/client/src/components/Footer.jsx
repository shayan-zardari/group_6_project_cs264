import "../index.css"

export default function Footer() {
    return (
        <footer>
            <div>

                <div className="footer-left">
                    <h2 class="logo">Task Scheduler</h2>
                    <p>Plan smarter. Achieve faster.</p>
                </div>

                <div className="footer-center">
                    <a href="#">Home</a>
                    <a href="#">Tasks</a>
                    <a href="#">Calendar</a>
                    <a href="#">About</a>
                </div>

                <div className="footer-right">
                    <p id="copyright"></p>
                </div>

            </div>
        </footer>
    )
}