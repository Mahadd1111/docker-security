import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-800">
      <section className='grid grid-cols-2 p-10 gap-20'>
        <div className='flex items-center justify-center'>
          <p className='text-4xl font-bold text-white'>Secure Your Docker Deployments with Ease</p>
        </div>
        <div className='border-2 border-blue-500 p-10 flex items-center justify-center'>
          <img src='docker-svgrepo-com.svg' className='h-40 w-1/2'></img>
        </div>
      </section>
      <section className='p-10 grid grid-cols-2 gap-40'>
        <Link href="/Clair" className='bg-white py-6 px-8 text-slate-800 font-bold text-xl hover:bg-gray-500 flex items-center justify-center rounded-2xl'>Secure Image With Clair</Link>
        <Link href="/Trivy" className='bg-white py-6 px-8 text-slate-800 font-bold text-xl hover:bg-gray-500 flex items-center justify-center rounded-2xl'>Secure Image With Trivy</Link>
      </section>
    </main>
  )
}
