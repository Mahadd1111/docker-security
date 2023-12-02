"use client"
import axios from "axios"
import { useEffect, useState } from "react"

const ImageSec = () => {
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
            ipAddress: '192.168.190.128',
            reportPath: 'scan-report.json'
        }
        try {
            setLoading("Scanning Vulnerabilities...")
            const data = await axios.post('http://localhost:4000/secure-image', imageData)
            setLoading("Scan Complete")
            console.log("Returned Data: ", data)
            try {
                const fileData = await axios.get(`http://localhost:4000/read-file`);
                console.log("File Data:", fileData);
                setVulnerabilities(fileData.data.vulnerabilities)
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log("Returned Error: ", error)
            if (error.response) {
                console.error("Server Error Data:", error.response.data);
                console.error("Server Error Status:", error.response.status);
                console.error("Server Error Headers:", error.response.headers);
                const errorMessage = "Cannot Scan The Image";
                alert(`Error: ${errorMessage}`);
                setLoading("")
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("No response received from the server");
                setLoading("")
            } else {
                console.error("Request setup error:", error.message);
                alert("Error setting up the request");
                setLoading("")
            }
        }

    }

    return (
        <div className="p-10 flex min-h-screen flex-col  bg-slate-800">
            <div className="flex flex-row justify-start items-end gap-10">
                <div className="flex flex-col gap-2 text-white justify-center">
                    <label>Enter Image Name</label>
                    <input type="text" onChange={(e) => { setImage(e.target.value); console.log(image) }} value={image} placeholder="Eg. Alpine:latest" className="text-black w-80 rounded-lg py-2 px-4"></input>
                </div>
                <button onClick={checkImageSec} className="bg-white rounded-lg px-4 py-2 h-10 text-slate-800 text-xl font-bold">Click Me</button>
            </div>
            <p className="text-white font-bold text-2xl my-10">{loading}</p>
            <div className="flex flex-col gap-10">
                <p className="text-white font-bold text-2xl">Vulnerabilities</p>
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="">
                        <thead className="py-5">
                            <tr className="bg-gray-600 text-white font-bold py-5 px-6">
                                <td className="px-4 py-2">Feature Name</td>
                                <td className="px-4 py-2">Feature Version</td>
                                <td className="px-4 py-2">Vulnerability</td>
                                <td className="px-4 py-2">Namespace</td>
                                <td className="px-4 py-2">Description</td>
                                <td className="px-4 py-2">Link</td>
                                <td className="px-4 py-2">Severity</td>
                                <td className="px-4 py-2">Fixed By</td>
                            </tr>
                        </thead>
                        <tbody >
                            {vulnerabilities.length > 0 ? (
                                vulnerabilities.map((item, index) => (
                                    <tr key={index} className={`text-black text-center text-wrap text-sm py-3 px-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}`}>
                                        <td className="px-2">{item.featurename}</td>
                                        <td className="px-2">{item.featureversion}</td>
                                        <td className="px-2" >{item.vulnerability}</td>
                                        <td className="px-2">{item.namespace}</td>
                                        <td className="px-2">{item.description}</td>
                                        <td className="px-2">{item.link}</td>
                                        <td className="px-2">{item.severity}</td>
                                        <td className="px-2">{item.fixedby}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center px-4 py-2 mt-10 text-red-500">
                                        No data available
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

export default ImageSec