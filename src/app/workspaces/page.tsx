'use client'
import React, { Suspense } from "react"
import WorkspaceComponent from "@/components/workspace/WorkspaceComponent"


export default function Workspaces() {
  return (
    <Suspense>
        <WorkspaceComponent/>
    </Suspense>
  )
}
