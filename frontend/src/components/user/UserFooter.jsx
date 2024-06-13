import { GiBananaBunch } from "react-icons/gi"
import { FaYoutube } from "react-icons/fa"
import { IoLogoGithub } from "react-icons/io5"

const UserFooter = () => {
    return (
        <div className="footer items-center p-4 bg-base-300 text-base-content">
            <aside className="items-center grid-flow-col">
                <GiBananaBunch className="text-slate-500" size={30} />
                <p>Copyright © 2024 - All right reserved</p>
            </aside>
            <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                <a href=""><FaYoutube className="text-slate-500" size={25} /></a>
                <a href=""><IoLogoGithub className="text-slate-500" size={25} /></a>
            </nav>
        </div>
    )
}

export default UserFooter
