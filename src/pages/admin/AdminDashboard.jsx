import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Home, User, LogOut, X } from "lucide-react"
import Legalease from '../../assets/images/Legalease.png'
import { useAuth} from'../../hooks/useAuth'
import { baseUrl } from "../../config/Baseurl"

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

  // ADD ADMIN MODAL STATE
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [addAdminError, setAddAdminError] = useState(null)
  const [addAdminResult, setAddAdminResult] = useState(null)

  const { url }=baseUrl()

  const { Logout }= useAuth()

  // PAGINATION STATE
  const [appsPage, setAppsPage] = useState(1)
  const [verifiedPage, setVerifiedPage] = useState(1)
  const [usersPage, setUsersPage] = useState(1)
  const PAGE_SIZE = 10

  // GET CURRENT USER ROLE FROM TOKEN
  const token = localStorage.getItem("token")
  const userRole = token ? JSON.parse(atob(token.split(".")[1]))?.role : null
  const isSuperAdmin = userRole === "SUPERADMIN"

  // FETCH ALL APPLICATIONS
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`${url}/api/admin/applications`, 
          {
            headers:{
              Authorization: `${localStorage.getItem('token')}`
            }
          }
        ) 
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
          const res = await fetch(`${url}/api/admin/users`,
             {
            headers:{
              Authorization: `${localStorage.getItem('token')}`
            }
          }
          ) 
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
      const res = await fetch(`${url}/api/admin/applications/${appId}`,
        {
            headers:{
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
      )
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
      const res = await fetch(`${url}/api/admin/applications/${appId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
    const res = await fetch(`${url}/api/admin/applications/${appId}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to reject application")

    setApplications(prev => prev.filter(app => app.id !== appId))
    if (selectedApp?.id === appId) setSelectedApp(null)

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
      const res = await fetch(`${url}/api/admin/applications/${appId}/revoke`, {
        method: "PATCH", 
        headers: { 
          "Content-Type": "application/json",
           Authorization: `Bearer ${localStorage.getItem("token")}`
         }
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

  // ADD NEW ADMIN
  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) return
    setIsAddingAdmin(true)
    setAddAdminError(null)
    setAddAdminResult(null)
    try {
      const res = await fetch(`${url}/api/admin/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email: newAdminEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add admin")
      // Store result so we can show success state (and temp password if mail failed)
      setAddAdminResult(data)
      setNewAdminEmail("")
    } catch (err) {
      setAddAdminError(err.message)
    } finally {
      setIsAddingAdmin(false)
    }
  }

  const handleCloseAddAdminModal = () => {
    setIsAddAdminModalOpen(false)
    setNewAdminEmail("")
    setAddAdminError(null)
    setAddAdminResult(null)
  }

  // Helpers
  const getStatusBadge = (isActive) => isActive ? "bg-green-100 text-green-800" : "bg-secondary-container text-on-secondary-container"

  const paginate = (data, page) => {
    const start = (page - 1) * PAGE_SIZE
    return data.slice(start, start + PAGE_SIZE)
  }

  const Pagination = ({ total, page, setPage }) => {
    const totalPages = Math.ceil(total / PAGE_SIZE)
    if (totalPages <= 1) return null
    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/40">
        <p className="text-xs text-on-surface-variant">
          Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                n === page ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    )
  }
  
  // Data Filters
  const pendingApplications = applications.filter(app => !app.is_active)
  const verifiedLawyers = applications.filter(app => app.is_active)

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      
      {/* Sidebar Navigation*/}
      <aside className="w-full md:w-64 md:fixed md:top-0 md:left-0 md:h-screen bg-surface-container-lowest border-r border-outline-variant/40 p-6 flex flex-col z-40">
  
        <div className="flex items-center gap-2 mb-10">
          <div className="md:size-16 rounded-lg flex items-center justify-center">
            <img
              src={Legalease}
              alt="Logo"
              className="size-14 md:size-16 object-contain"
            />
          </div>
          <span className="text-sm font-bold text-on-surface tracking-wide">
            Admin Dashboard
          </span>
        </div>

        {/* TOP NAV */}
        <nav className="flex flex-col gap-2">
          
          <button
            onClick={() => setCurrentView("applications")}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentView === "applications"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Pending Approvals</span>
            {pendingApplications.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  currentView === "applications"
                    ? "bg-on-primary text-primary"
                    : "bg-primary text-on-primary"
                }`}
              >
                {pendingApplications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView("verified")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentView === "verified"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            Verified Directory
          </button>

          <button
            onClick={() => setCurrentView("users")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentView === "users"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            System Users
          </button>

          {/* SUPERADMIN ONLY*/}
          {isSuperAdmin && (
            <button
              onClick={() => setIsAddAdminModalOpen(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-on-surface-variant hover:bg-surface-container border border-dashed border-outline-variant mt-2"
            >
              + Add Admin
            </button>
          )}
        </nav>

        {/* exit*/}
        <div className="mt-auto pt-6">
          <div className="bg-outline-variant/40 h-px w-full mb-6"></div>
          <button
            onClick={Logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container text-sm font-medium transition-colors"
          >
            Exit to App
          </button>
        </div>
      </aside>

      {/* Main Content*/}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
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
                <>
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
                          paginate(pendingApplications, appsPage).map((app) => (
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
                  <Pagination total={pendingApplications.length} page={appsPage} setPage={setAppsPage} />
                </>
              )}
            </div>
          )}

          {/* VERIFIED DIRECTORY */}
          {currentView === "verified" && (
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden animate-in fade-in duration-300">
              {isAppsLoading ? (
                <div className="p-20 flex justify-center"><span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
              ) : (
                <>
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
                          paginate(verifiedLawyers, verifiedPage).map((app) => (
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
                  <Pagination total={verifiedLawyers.length} page={verifiedPage} setPage={setVerifiedPage} />
                </>
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
                <>
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
                          paginate(users, usersPage).map((user) => (
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
                  <Pagination total={users.length} page={usersPage} setPage={setUsersPage} />
                </>
              )}
            </div>
          )}

        </div>
      </main>

      {/* LAWYER DETAILS MODAL */}
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
                  <p className="text-sm text-on-surface-variant font-medium mt-1">LSK: {selectedApp.lsk_number} • {selectedApp.phone_number}</p>
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

      {/* ADD ADMIN MODAL */}
      {isAddAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-primary px-6 py-5 flex items-center justify-between">
              <h3 className="text-on-primary font-bold text-lg">
                {addAdminResult ? "Admin Created" : "Add New Admin"}
              </h3>
              <button
                onClick={handleCloseAddAdminModal}
                className="text-on-primary/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8">

              {/* SUCCESS STATE */}
              {addAdminResult ? (
                <div>
                  {addAdminResult.emailSent ? (
                    // Mail delivered successfully
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-lg">Admin added successfully</p>
                        <p className="text-sm text-on-surface-variant mt-1">Login credentials have been sent to their email address.</p>
                      </div>
                      <button onClick={handleCloseAddAdminModal} className="mt-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity">Done</button>
                    </div>
                  ) : (
                    // Mail failed
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                        <div>
                          <p className="text-sm font-bold text-yellow-800">Email delivery failed</p>
                          <p className="text-xs text-yellow-700 mt-0.5">The admin was created but the credentials email could not be sent. Share the temporary password below with them manually.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Temporary Password</p>
                        <div className="flex items-center gap-2 p-3 bg-surface-container rounded-xl border border-outline-variant">
                          <code className="flex-1 text-sm font-mono text-on-surface">{addAdminResult.tempPassword}</code>
                          <button
                            onClick={() => navigator.clipboard.writeText(addAdminResult.tempPassword)}
                            className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <button onClick={handleCloseAddAdminModal} className="mt-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity w-full">Done</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-sm text-on-surface-variant mb-6">Enter the email of an existing user to promote them to admin. A temporary password will be generated and emailed to them.</p>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddAdmin()}
                      placeholder="user@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {addAdminError && (
                    <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{addAdminError}</div>
                  )}
                  <div className="flex gap-3 justify-end mt-6">
                    <button
                      onClick={handleCloseAddAdminModal}
                      className="px-6 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAdmin}
                      disabled={isAddingAdmin || !newAdminEmail.trim()}
                      className="px-6 py-3 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {isAddingAdmin ? "Creating Admin..." : "Create Admin"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}