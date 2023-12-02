import Link from "next/link"


const Navbar = ()=>{
    return(
        <div className="px-5 py-2 h-24 bg-black font-bold text-white flex flex-row justify-between items-center">
            <p>Docker Security</p>
            <div className="flex flex-row gap-5">
                <Link href="/">Home</Link>
                <Link href="/Image">Image</Link>
                <Link href="#">Container</Link>
            </div>
        </div>
    )
}

export default Navbar