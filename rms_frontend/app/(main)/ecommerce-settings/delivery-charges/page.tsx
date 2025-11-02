"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function DeliveryChargesSettingsPage() {
    const [inside, setInside] = useState<string>("")
    const [outside, setOutside] = useState<string>("")
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/ecommerce/delivery-settings/`, { credentials: "include" })
                if (res.ok) {
                    const data = await res.json()
                    setInside(String(data.inside_dhaka_charge ?? "0"))
                    setOutside(String(data.outside_dhaka_charge ?? "0"))
                }
            } catch {}
        })()
    }, [])

    const save = async () => {
        setSaving(true)
        setMessage("")
        try {
            const res = await fetch(`${API_BASE_URL}/ecommerce/delivery-settings/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    inside_dhaka_charge: inside,
                    outside_dhaka_charge: outside,
                }),
            })
            if (!res.ok) throw new Error("Failed to save")
            setMessage("Saved")
        } catch (e) {
            setMessage("Failed to save")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Delivery Charges</h1>
            <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                    <Label htmlFor="inside">Inside Dhaka (৳)</Label>
                    <Input id="inside" type="number" value={inside} onChange={(e) => setInside(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="outside">Outside Dhaka (৳)</Label>
                    <Input id="outside" type="number" value={outside} onChange={(e) => setOutside(e.target.value)} />
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                    {message && <span className="text-sm text-muted-foreground">{message}</span>}
                </div>
            </div>
        </div>
    )
}
