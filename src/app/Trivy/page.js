"use client"
import axios from "axios"
import { useEffect, useState } from "react"

const TrivyImageSec = () => {
    const [loading, setLoading] = useState("")
    const [manifest, setManifest] = useState({})
    const [vulnerabilities, setVulnerabilities] = useState([])
    const [image, setImage] = useState("")

    useEffect(() => {
        console.log(vulnerabilities)
    }, [vulnerabilities]);


    async function checkImageSec() {
        const imageData = {
            imageName: image,
        }
        try {
            setLoading("Scanning Vulnerabilities...")
            const data = await axios.post('http://localhost:4000/secure-image-trivy', imageData)
            setLoading("Scan Complete")
            console.log("Returned Data: ", data)
            try {
                const fileData = await axios.get(`http://localhost:4000/read-file`,{ params: { fileName: 'scan-report-trivy.json' } });
                console.log("File Data:", fileData);
                let allVulnerabilities = [];
                fileData.data.Results.forEach(result => {
                    if (result.Vulnerabilities && Array.isArray(result.Vulnerabilities)) {
                        allVulnerabilities = allVulnerabilities.concat(result.Vulnerabilities);
                    }
                });
                setVulnerabilities(allVulnerabilities);
            } catch (error) {
                console.log(error)
                const errorMessage = "Error Comprehending Results";
                alert(`Error: ${errorMessage}`);
                setLoading("")
            }
        } catch (error) {
            console.log("Returned Error: ", error)
            const errorMessage = "Cannot Scan The Image";
            alert(`Error: ${errorMessage}`);
            setLoading("")
        }

    }

    return (
        <div className="p-10 flex min-h-screen flex-col  bg-slate-800">
            <div className="flex flex-row justify-start items-end gap-10">
                <div className="flex flex-col gap-2 text-white justify-center">
                    <label>Enter Image Name</label>
                    <input type="text" onChange={(e) => { setImage(e.target.value); console.log(image) }} value={image} placeholder="Eg. Alpine:latest" className="text-black w-80 rounded-lg py-2 px-4"></input>
                </div>
                <button onClick={checkImageSec} className="bg-white rounded-lg px-4 py-2 h-10 text-slate-800 text-xl font-bold">Scan With Trivy</button>
            </div>
            <p className="text-white font-bold text-2xl my-10">{loading}</p>
            <div className="flex flex-col gap-10">
                <p className="text-white font-bold text-2xl">Vulnerabilities</p>
                <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
                    <table className="">
                        <thead className="py-5">
                            <tr className="bg-gray-600 text-white font-bold py-5 px-6">
                                <td className="px-4 py-2">Vulnerability ID</td>
                                <td className="px-4 py-2">Package Name</td>
                                <td className="px-4 py-2">Installed Version</td>
                                <td className="px-4 py-2">Status</td>
                                <td className="px-4 py-2">Title</td>
                                <td className="px-4 py-2">Link</td>
                                <td className="px-4 py-2">Severity</td>
                                <td className="px-4 py-2">Fixed Version</td>
                            </tr>
                        </thead>
                        <tbody >
                            {vulnerabilities.length > 0 ? (
                                vulnerabilities.map((item, index) => (
                                    <tr key={index} className={`text-black text-center text-wrap text-sm py-3 px-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}`}>
                                        <td className="px-2">{item.VulnerabilityID}</td>
                                        <td className="px-2">{item.PkgName}</td>
                                        <td className="px-2" >{item.InstalledVersion}</td>
                                        <td className="px-2">{item.Status}</td>
                                        <td className="px-2">{item.Title}</td>
                                        <td className="px-2">{item.PrimaryURL}</td>
                                        <td className="px-2">{item.Severity}</td>
                                        <td className="px-2">{item.FixedVersion}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center px-4 py-2 mt-10 text-red-500">
                                        No Vulnerabilities To Show
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            </div>

        </div>
    )
}

export default TrivyImageSec