import Cockpit from '@/components/admin/cockpit'
import DashboardLayout from '@/layout/dashboard/DashboardLayout'
import { Container } from '@mui/system'
import React from 'react'

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <Cockpit />
    </DashboardLayout>
  )
}

export default AdminDashboard