"use client"
import { useRouter } from 'next/navigation'

export default function page() {
    const router = useRouter()

    return router.push("/people/all")
}
