"use client"

import { useState, useEffect } from "react"

const BD_API_BASE = "https://bdapi.vercel.app/api/v.1"

export interface Division {
    id: string | number
    name: string
    bn_name: string
    url: string
}

export interface District {
    id: string | number
    name: string
    bn_name?: string
    url?: string
    [key: string]: any
}

export interface Upazilla {
    id: string | number
    district_id: string | number
    name: string
    bn_name: string
    url: string
    [key: string]: any
}

export interface Union {
    id: string | number
    upazilla_id: string | number
    name: string
    bn_name: string
    url: string
    [key: string]: any
}

export function useBdAddress() {
    const [divisions, setDivisions] = useState<Division[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [upazillas, setUpazillas] = useState<Upazilla[]>([])
    const [unions, setUnions] = useState<Union[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingDistricts, setLoadingDistricts] = useState(false)
    const [loadingUpazillas, setLoadingUpazillas] = useState(false)
    const [loadingUnions, setLoadingUnions] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [unionError, setUnionError] = useState<string | null>(null)

    const [selectedDivision, setSelectedDivision] = useState<string>("")
    const [selectedDivisionId, setSelectedDivisionId] = useState<string | number>("")
    const [selectedDistrict, setSelectedDistrict] = useState<string>("")
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | number>("")
    const [selectedUpazilla, setSelectedUpazilla] = useState<string>("")
    const [selectedUpazillaId, setSelectedUpazillaId] = useState<string | number>("")

    // Fetch all divisions on mount
    useEffect(() => {
        const fetchDivisions = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`${BD_API_BASE}/division`)
                if (!response.ok) throw new Error("Failed to fetch divisions")
                const data = await response.json()

                if (data.status === 200 && data.success && data.data && Array.isArray(data.data)) {
                    setDivisions(data.data)
                } else if (Array.isArray(data)) {
                    setDivisions(data)
                } else {
                    throw new Error("Invalid response format")
                }
            } catch (err: any) {
                setError(err?.message || "Failed to fetch divisions")
                console.error("Error fetching divisions:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchDivisions()
    }, [])


    // Fetch districts when division is selected using district/:divisionId
    useEffect(() => {
        if (!selectedDivisionId) {
            setDistricts([])
            setUpazillas([])
            setSelectedDistrict("")
            setSelectedDistrictId("")
            setSelectedUpazilla("")
            setSelectedUpazillaId("")
            setUnions([])
            return
        }

        const fetchDistricts = async () => {
            setLoadingDistricts(true)
            setError(null)
            try {
                const encodedDivisionId = encodeURIComponent(selectedDivisionId.toString())
                const url = `${BD_API_BASE}/district/${encodedDivisionId}`

                const response = await fetch(url)

                if (response.ok) {
                    const data = await response.json()

                    let districtData: District[] = []

                    if (data.status === 200 && data.success && data.data && Array.isArray(data.data)) {
                        districtData = data.data
                    } else if (Array.isArray(data)) {
                        districtData = data
                    } else if (data.data && Array.isArray(data.data)) {
                        districtData = data.data
                    }

                    setDistricts(districtData)
                } else {
                    setDistricts([])
                    setError("Failed to fetch districts")
                }
            } catch (err: any) {
                setError(err?.message || "Failed to fetch districts")
                console.error("Error fetching districts:", err)
                setDistricts([])
            } finally {
                setLoadingDistricts(false)
            }
        }

        fetchDistricts()
    }, [selectedDivisionId])

    // Fetch upazillas when district is selected using upazilla/:districtId
    useEffect(() => {
        if (!selectedDistrictId) {
            setUpazillas([])
            setSelectedUpazilla("")
            setSelectedUpazillaId("")
            setUnions([])
            return
        }

        const fetchUpazillas = async () => {
            setLoadingUpazillas(true)
            try {
                const encodedDistrictId = encodeURIComponent(selectedDistrictId.toString())
                const url = `${BD_API_BASE}/upazilla/${encodedDistrictId}`

                const response = await fetch(url)

                if (response.ok) {
                    const data = await response.json()

                    let upazillaData: Upazilla[] = []

                    // Handle response format: {status: 200, success: true, data: [...]}
                    if (data.status === 200 && data.success === true && data.data && Array.isArray(data.data)) {
                        upazillaData = data.data
                    } else if (Array.isArray(data)) {
                        // Fallback: direct array response
                        upazillaData = data
                    } else if (data.data && Array.isArray(data.data)) {
                        // Fallback: data array without status check
                        upazillaData = data.data
                    }

                    setUpazillas(upazillaData)
                } else {
                    setUpazillas([])
                }
            } catch (err) {
                console.error("Error fetching upazillas:", err)
                setUpazillas([])
            } finally {
                setLoadingUpazillas(false)
            }
        }

        fetchUpazillas()
    }, [selectedDistrictId])

    // Fetch unions when upazilla is selected using union/:upazillaId
    useEffect(() => {
        if (!selectedUpazillaId) {
            setUnions([])
            setUnionError(null)
            return
        }

        const fetchUnions = async () => {
            setLoadingUnions(true)
            setUnionError(null)

            try {
                const encodedUpazillaId = encodeURIComponent(selectedUpazillaId.toString())
                const url = `${BD_API_BASE}/union/${encodedUpazillaId}`

                const response = await fetch(url)

                if (response.ok) {
                    const data = await response.json()

                    let unionData: Union[] = []

                    // Handle response format: can be array directly or wrapped in {status, success, data}
                    if (Array.isArray(data)) {
                        // Direct array response: [{id, upazilla_id, name, bn_name, url}, ...]
                        unionData = data
                    } else if (data.status === 200 && data.success === true && data.data && Array.isArray(data.data)) {
                        // Wrapped response: {status: 200, success: true, data: [...]}
                        unionData = data.data
                    } else if (data.data && Array.isArray(data.data)) {
                        // Fallback: data array without status check
                        unionData = data.data
                    }

                    setUnions(unionData)

                    if (unionData.length === 0) {
                        setUnionError("No unions found for this upazilla")
                    }
                } else {
                    setUnions([])
                    setUnionError("Failed to fetch unions. Please try again.")
                }
            } catch (err) {
                console.error("Error fetching unions:", err)
                setUnions([])
                setUnionError("Failed to fetch unions. Please try again.")
            } finally {
                setLoadingUnions(false)
            }
        }

        fetchUnions()
    }, [selectedUpazillaId])

    const resetDistrict = () => {
        setSelectedDistrict("")
        setSelectedDistrictId("")
        setUpazillas([])
        setSelectedUpazilla("")
        setSelectedUpazillaId("")
        setUnions([])
    }

    const resetUpazilla = () => {
        setSelectedUpazilla("")
        setSelectedUpazillaId("")
        setUnions([])
    }

    return {
        divisions,
        districts,
        upazillas,
        unions,
        loading,
        loadingDistricts,
        loadingUpazillas,
        loadingUnions,
        error,
        unionError,
        selectedDivision,
        selectedDivisionId,
        selectedDistrict,
        selectedDistrictId,
        selectedUpazilla,
        selectedUpazillaId,
        setSelectedDivision: (name: string, id: string | number) => {
            setSelectedDivision(name)
            setSelectedDivisionId(id)
        },
        setSelectedDistrict: (name: string, id: string | number) => {
            setSelectedDistrict(name)
            setSelectedDistrictId(id)
        },
        setSelectedUpazilla: (name: string, id: string | number) => {
            setSelectedUpazilla(name)
            setSelectedUpazillaId(id)
        },
        resetDistrict,
        resetUpazilla,
    }
}
