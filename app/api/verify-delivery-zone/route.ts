import { NextResponse } from "next/server"

// This is a sample implementation. Replace with your actual delivery zone logic
const DELIVERY_ZONES = [
  {
    state: "Lagos",
    localGovernments: [
      {
        name: "Ajeromi/Ifelodun",
        localities: ["Olodi", "Ajegunle", "Amukoko", "Layeni"],
      },
      {
        name: "Apapa",
        localities: ["Apapa", "Ajegunle", "Ijora"],
      },
      {
        name: "Surulere",
        localities: ["Surulere", "Ojuelegba", "Itire", "Lawanson"],
      },
      {
        name: "Lagos Island",
        localities: ["Lagos Island", "Marina", "Obalende"],
      },
    ],
  },
]

export async function POST(request: Request) {
  try {
    const { state, localGovernment, locality } = await request.json()

    // Find the state
    const stateZone = DELIVERY_ZONES.find((zone) => zone.state.toLowerCase() === state.toLowerCase())

    if (!stateZone) {
      return NextResponse.json({ isDeliverable: false, message: "We don't deliver to this state yet." })
    }

    // Find the local government
    const lgZone = stateZone.localGovernments.find((lg) => lg.name.toLowerCase() === localGovernment.toLowerCase())

    if (!lgZone) {
      return NextResponse.json({
        isDeliverable: false,
        message: `We don't deliver to ${localGovernment} in ${state} yet.`,
      })
    }

    // Check if we deliver to this locality
    const isLocalitySupported = lgZone.localities.some((loc) => loc.toLowerCase() === locality.toLowerCase())

    if (!isLocalitySupported && locality) {
      return NextResponse.json({
        isDeliverable: false,
        message: `We don't deliver to ${locality}, ${localGovernment} yet.`,
      })
    }

    // All checks passed
    return NextResponse.json({
      isDeliverable: true,
      message: "Great! We deliver to your area.",
    })
  } catch (error) {
    console.error("Error verifying delivery zone:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}

