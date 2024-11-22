"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/app/login/auth-context"
import { X, CheckCircle } from 'lucide-react'

interface Emergency {
  id: string
  location: string
  type: string
  timeReported: string
  resolved: boolean
}

export default function EmergencyTable() {
  const { loggedIn } = useAuth()
  
  const [emergencies, setEmergencies] = useState<Emergency[]>([
    {
      id: "1",
      location: "Metrotown",
      type: "shooting",
      timeReported: "2023-11-01 (5:30pm)",
      resolved: true
    },
    {
      id: "2",
      location: "SFU Burnaby",
      type: "medical",
      timeReported: "2023-10-30 (1:34pm)",
      resolved: false
    },
    {
      id: "3",
      location: "SFU Surrey",
      type: "elevator",
      timeReported: "2023-10-22 (5:30am)",
      resolved: false
    }
  ])

  const handleStatusChange = (id: string) => {
    console.log(`Toggling status for emergency ${id}`)
    setEmergencies(emergencies.map(emergency => 
      emergency.id === id ? {...emergency, resolved: !emergency.resolved} : emergency
    ))
  }

  const handleDelete = (id: string) => {
    const emergency = emergencies.find(e => e.id === id);
    if (emergency) {
      console.log(`${emergency.resolved ? "Clearing" : "Deleting"} emergency ${id}`);
      // Here you would typically update your backend
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Time Reported</TableHead>
            <TableHead>Status</TableHead>
            {loggedIn && <TableHead>Toggle Status</TableHead>}
            <TableHead>Actions</TableHead>
            {loggedIn && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {emergencies.map((emergency) => (
            <TableRow key={emergency.id}>
              <TableCell>{emergency.location}</TableCell>
              <TableCell>{emergency.type}</TableCell>
              <TableCell>{emergency.timeReported}</TableCell>
              <TableCell>{emergency.resolved ? "RESOLVED" : "OPEN"}</TableCell>
              {loggedIn && (
                <TableCell>
                  <Switch
                    checked={emergency.resolved}
                    onCheckedChange={() => handleStatusChange(emergency.id)}
                  />
                </TableCell>
              )}
              <TableCell>
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  MORE INFO
                </Button>
              </TableCell>
                <TableCell>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(emergency.id)}
                    className={emergency.resolved ? "text-green-500 hover:text-green-600" : "text-destructive hover:text-destructive"}
                    >
                    {emergency.resolved ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

