"use client"
import axios from "axios"
import { useState } from "react"

const ImageSec = ()=>{
    const [loading,setLoading]=useState("")
    const [manifest,setManifest]=useState({})

    async function getManifestDigest(imageName, imageTag) {
        
    }

    async function checkImageSec(){
        const imageData = {
            imageName:'alpine',
            imageTag:'latest'
        }
        try{
            setLoading("Loading Manifest...")
            const data = await axios.post('http://localhost:4000/manifest-digest',imageData)
            setLoading("")
            console.log("Returned Data: ",data)
        }catch(error){
            console.log("Returned Error: ",error)
        }
        setManifest(
            {
                "schemaVersion": 2,
                "mediaType": "application/vnd.docker.distribution.manifest.list.v2+json",
                "manifests": [
                   {
                      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
                      "size": 528,
                      "digest": "sha256:d695c3de6fcd8cfe3a6222b0358425d40adfd129a8a47c3416faff1a8aece389",
                      "platform": {
                         "architecture": "amd64",
                         "os": "linux"
                      }
                   },
                   {
                      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
                      "size": 528,
                      "digest": "sha256:1832ef473ede9a923cc6affdf13b54a1be6561ad2ce3c3684910260a7582d36b",
                      "platform": {
                         "architecture": "arm",
                         "os": "linux",
                         "variant": "v6"
                      }
                   },
                   {
                      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
                      "size": 528,
                      "digest": "sha256:211fe64069acea47ea680c0943b5a77be1819d0e85365011595391f7562caf27",
                      "platform": {
                         "architecture": "arm",
                         "os": "linux",
                         "variant": "v7"
                      }
                   },
                   {
                      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
                      "size": 528,
                      "digest": "sha256:d4ade3639c27579321046d78cc44ec978cea8357d56932611984f601d27e30ac",
                      "platform": {
                         "architecture": "arm64",
                         "os": "linux",
                         "variant": "v8"
                      }
                   },
                   {
                      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
                      "size": 528,
                      "digest": "sha256:5ece42cd6ca30ec1a4cc5e1e10a260ad4906e1d4588ae0ef486874d72b3857ad",
                      "platform": {
                         "architecture": "386",
                         "os": "linux"
                      }
                   },
                   {
                      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
                      "size": 528,
                      "digest": "sha256:1698bcd6bf339e1578dfb9f0034dff615e3eec8404517045046ecbeb84ad01d6",
                      "platform": {
                         "architecture": "ppc64le",
                         "os": "linux"
                      }
                   },
                   {
                      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
                      "size": 528,
                      "digest": "sha256:5c63479aeed37522de78284d99dcd32f9ad288b04a56236f44e78b3b3f62ebd2",
                      "platform": {
                         "architecture": "s390x",
                         "os": "linux"
                      }
                   }
                ]
             }
             
        );
        try{
            setLoading("Loading Indexer...")
            const data2 = await axios.post('http://localhost:4000/secure-image',{data:manifest})
            setLoading("")
            console.log("Returned Data (Indexer): ",data2)
        }catch(error){
            console.log("Returned Error: ",error)
        }
        
    }

    return(
        <div className="p-10 flex min-h-screen flex-col bg-slate-800">
            <button onClick={checkImageSec} className="bg-white px-4 py-2 text-slate-800 text-xl font-bold">Click Me</button>
            <p className="text-white font-bold text-2xl">{loading}</p>
        </div>
    )
}

export default ImageSec