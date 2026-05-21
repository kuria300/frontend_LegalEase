import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const navigate = useNavigate()
  
  const [currentView, setCurrentView] = useState("applications")

  const [applications, setApplications] = useState([])
  const [isAppsLoading, setIsAppsLoading] = useState(true)
  const [appsError, setAppsError] = useState(null)
  
  const [users, setUsers] = useState([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState(null)

  const [selectedApp, setSelectedApp] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(null) 

  // FETCH ALL APPLICATIONS
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/admin/applications") 
        if (!res.ok) throw new Error("Failed to fetch applications")
        const data = await res.json()
        setApplications(data)
      } catch (err) {
        setAppsError(err.message)
      } finally {
        setIsAppsLoading(false)
      }
    }
    fetchApplications()
  }, [])

  // FETCH ALL USERS
  useEffect(() => {
    if (currentView === "users" && users.length === 0) {
      const fetchUsers = async () => {
        setIsUsersLoading(true)
        try {
          const res = await fetch("/api/admin/users") 
          if (!res.ok) throw new Error("Failed to fetch users")
          const data = await res.json()
          setUsers(data)
        } catch (err) {
          setUsersError(err.message)
        } finally {
          setIsUsersLoading(false)
        }
      }
      fetchUsers()
    }
  }, [currentView, users.length])

  // GET APPLICATION BY ID
  const handleViewApplication = async (appId) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}`)
      if (!res.ok) throw new Error("Failed to fetch details")
      const data = await res.json()
      setSelectedApp(data)
      setIsModalOpen(true)
    } catch (err) {
      alert(err.message)
    }
  }

  // VERIFY LAWYER
  const handleApprove = async (appId) => {
    if (!window.confirm("Are you sure you want to verify this lawyer?")) return
    setIsProcessing(appId)
    try {
      const res = await fetch(`/api/admin/applications/${appId}/approve`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Failed to verify lawyer")
      
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, is_active: true } : app
      ))
      if (selectedApp?.id === appId) setSelectedApp({ ...selectedApp, is_active: true })
    } catch (err) {
      alert(err.message)
    } finally {
      setIsProcessing(null)
    }
  }

  // REJECT APPLICATION
  const handleReject = async (appId) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return
    setIsProcessing(appId + "-reject")
    try {
      const res = await fetch(`/api/admin/applications/${appId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Failed to reject application")

      setApplications(applications.map(app =>
        app.id === appId ? { ...app, status: "rejected", is_active: false } : app
      ))
      if (selectedApp?.id === appId) setSelectedApp({ ...selectedApp, status: "rejected", is_active: false })
    } catch (err) {
      alert(err.message)
    } finally {
      setIsProcessing(null)
    }
  }

  // SUSPEND LAWYER
  const handleRevoke = async (appId) => {
    if (!window.confirm("Are you sure you want to suspend this lawyer? They will be removed from the public directory.")) return
    setIsProcessing(appId)
    try {
      const res = await fetch(`/api/admin/applications/${appId}/revoke`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Failed to suspend lawyer")
      
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, is_active: false } : app
      ))
      if (selectedApp?.id === appId) setSelectedApp({ ...selectedApp, is_active: false })
    } catch (err) {
      alert(err.message)
    } finally {
      setIsProcessing(null)
    }
  }

  // Helpers
  const getStatusBadge = (isActive) => isActive ? "bg-green-100 text-green-800" : "bg-secondary-container text-on-secondary-container"
  
  // Data Filters
  const pendingApplications = applications.filter(app => !app.is_active)
  const verifiedLawyers = applications.filter(app => app.is_active)

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-surface-container-lowest border-r border-outline-variant/40 md:min-h-screen p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span className="font-bold text-on-surface tracking-wide">Admin Dashboard</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button onClick={() => setCurrentView("applications")} className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === "applications" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"}`}>
            <span>Pending Approvals</span>
            {pendingApplications.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${currentView === "applications" ? "bg-on-primary text-primary" : "bg-primary text-on-primary"}`}>{pendingApplications.length}</span>
            )}
          </button>
          
          <button onClick={() => setCurrentView("verified")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === "verified" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"}`}>
            Verified Directory
          </button>
          
          <button onClick={() => setCurrentView("users")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === "users" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"}`}>
            System Users
          </button>

          <div className="h-px bg-outline-variant/40 my-2 w-full"></div>

          <button onClick={() => navigate("/")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container text-sm font-medium transition-colors">
            Exit to App
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-on-surface mb-2">
              {currentView === "applications" && "Pending Approvals"}
              {currentView === "verified" && "Verified Lawyers Directory"}
              {currentView === "users" && "System Users"}
            </h1>
            <p className="text-on-surface-variant text-sm">
              {currentView === "applications" && "Review credentials and certificates for new lawyer accounts."}
              {currentView === "verified" && "Manage active lawyers currently available to clients on the platform."}
              {currentView === "users" && "Manage and view all registered users in the platform."}
            </p>
          </div>

          {/* PENDING APPLICATIONS */}
          {currentView === "applications" && (
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden animate-in fade-in duration-300">
              {isAppsLoading ? (
                <div className="p-20 flex justify-center"><span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
              ) : appsError ? (
                <div className="p-8 text-center text-red-600 bg-red-50 font-medium">{appsError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container border-b border-outline-variant/40">
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Lawyer</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">LSK Number</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {pendingApplications.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-8 text-center text-on-surface-variant text-sm">No pending applications. All caught up!</td></tr>
                      ) : (
                        pendingApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-on-surface">{app.user_name}</p>
                              <p className="text-xs text-on-surface-variant">{app.user_email}</p>
                            </td>
                            <td className="px-6 py-4"><span className="text-sm font-medium text-on-surface">{app.lsk_number}</span></td>
                            <td className="px-6 py-4"><span className="text-sm font-medium text-on-surface">{app.category}</span></td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleViewApplication(app.id)} className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors">Review</button>
                                {/* ADDED: Reject button */}
                                <button onClick={() => handleReject(app.id)} disabled={isProcessing === app.id + "-reject"} className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container text-xs font-semibold hover:opacity-90 disabled:opacity-50">
                                  {isProcessing === app.id + "-reject" ? "Rejecting..." : "Reject"}
                                </button>
                                <button onClick={() => handleApprove(app.id)} disabled={isProcessing === app.id} className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 disabled:opacity-50">
                                  {isProcessing === app.id ? "Verifying..." : "Verify"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VERIFIED DIRECTORY */}
          {currentView === "verified" && (
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden animate-in fade-in duration-300">
              {isAppsLoading ? (
                <div className="p-20 flex justify-center"><span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container border-b border-outline-variant/40">
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Lawyer</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Specialization</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Fee / Hr</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {verifiedLawyers.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-8 text-center text-on-surface-variant text-sm">No verified lawyers on the platform yet.</td></tr>
                      ) : (
                        verifiedLawyers.map((app) => (
                          <tr key={app.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-on-surface">{app.user_name}</p>
                              <p className="text-xs text-on-surface-variant">LSK: {app.lsk_number}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-on-surface">
                                {app.category}
                              </span>
                            </td>
                            <td className="px-6 py-4"><span className="text-sm font-medium text-on-surface">KSh {app.consultation_fee}</span></td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleViewApplication(app.id)} className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors">Details</button>
                                <button onClick={() => handleRevoke(app.id)} disabled={isProcessing === app.id} className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container text-xs font-semibold hover:opacity-90 disabled:opacity-50">
                                  {isProcessing === app.id ? "Suspending..." : "Suspend"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* USERS TABLE */}
          {currentView === "users" && (
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden animate-in fade-in duration-300">
              {isUsersLoading ? (
                <div className="p-20 flex justify-center"><span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
              ) : usersError ? (
                <div className="p-8 text-center text-red-600 bg-red-50 font-medium">{usersError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container border-b border-outline-variant/40">
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {users.length === 0 ? (
                        <tr><td colSpan="3" className="px-6 py-8 text-center text-on-surface-variant text-sm">No users found.</td></tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                                <div><p className="text-sm font-semibold text-on-surface">{user.name || "Unknown User"}</p><p className="text-xs text-on-surface-variant">{user.email}</p></div>
                              </div>
                            </td>
                            <td className="px-6 py-4"><span className="text-sm font-medium text-on-surface capitalize">{user.role || "user"}</span></td>
                            <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.is_active)}`}>{user.is_active ? "Active" : "Inactive"}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
            <div className="bg-primary px-6 py-5 flex items-center justify-between">
              <h3 className="text-on-primary font-bold text-lg">Lawyer Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-primary/60 hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-outline-variant/40">
                <div>
                  <h4 className="text-2xl font-bold text-on-surface">{selectedApp.user_name}</h4>
                  <p className="text-sm text-on-surface-variant font-medium mt-1">LSK: {selectedApp.lsk_number} • 📞 {selectedApp.phone_number}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusBadge(selectedApp.is_active)}`}>{selectedApp.is_active ? "Verified" : "Pending"}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm mb-6 pb-6 border-b border-outline-variant/40">
                <div><p className="text-on-surface-variant text-xs mb-1 uppercase tracking-wider font-bold">Specialization</p><p className="font-medium text-on-surface">{selectedApp.category}</p></div>
                <div><p className="text-on-surface-variant text-xs mb-1 uppercase tracking-wider font-bold">Experience</p><p className="font-medium text-on-surface">{selectedApp.experience} Years</p></div>
                <div><p className="text-on-surface-variant text-xs mb-1 uppercase tracking-wider font-bold">Consultation Fee</p><p className="font-medium text-on-surface">KSh {selectedApp.consultation_fee} / hr</p></div>
              </div>
              <div className="mb-6 pb-6 border-b border-outline-variant/40">
                <p className="text-on-surface-variant text-xs mb-2 uppercase tracking-wider font-bold">Professional Bio</p>
                <div className="p-4 bg-surface-container rounded-xl"><p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{selectedApp.description}</p></div>
              </div>
              {selectedApp.file_url ? (
                <div>
                  <a href={selectedApp.file_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-outline-variant text-secondary text-sm font-bold hover:bg-surface-container transition-colors">
                    View Practicing Certificate
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">No certificate file was provided with this application.</div>
              )}
              <div className="mt-8 flex gap-3 justify-end">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container text-sm font-semibold transition-colors">Close</button>
                {/* ADDED: Reject button in modal */}
                {!selectedApp.is_active && (
                  <button onClick={() => handleReject(selectedApp.id)} disabled={isProcessing === selectedApp.id + "-reject"} className="px-6 py-3 rounded-xl bg-error-container text-on-error-container text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                    {isProcessing === selectedApp.id + "-reject" ? "Rejecting..." : "Reject Application"}
                  </button>
                )}
                {selectedApp.is_active ? (
                  <button onClick={() => handleRevoke(selectedApp.id)} disabled={isProcessing === selectedApp.id} className="px-6 py-3 rounded-xl bg-error-container text-on-error-container text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                    {isProcessing === selectedApp.id ? "Suspending..." : "Suspend Lawyer"}
                  </button>
                ) : (
                  <button onClick={() => handleApprove(selectedApp.id)} disabled={isProcessing === selectedApp.id} className="px-6 py-3 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                    {isProcessing === selectedApp.id ? "Verifying..." : "Verify Lawyer"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}