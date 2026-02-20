import React, { useState, useEffect } from "react";
import { FaSearch, FaToggleOn, FaToggleOff, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../utils/api";
import "../../styles/shared.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    try {
      const params = filterRole ? `?role=${filterRole}` : "";
      const res = await api.get(`/admin/users${params}`);
      setUsers(res.data);
    } catch (error) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-active`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (error) {
      toast.error("Error updating user");
    }
  };

  const deleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View and manage all registered users</p>
      </div>

      <div className="search-bar">
        <div style={{ position: "relative", flex: 1 }}>
          <FaSearch style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <select className="form-control" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="hr">HR / Recruiters</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td style={{ fontWeight: 600 }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-badge`} style={{
                        background: user.role === "admin" ? "rgba(239,68,68,0.1)" : user.role === "hr" ? "rgba(14,165,233,0.1)" : "rgba(16,185,129,0.1)",
                        color: user.role === "admin" ? "var(--danger)" : user.role === "hr" ? "var(--secondary)" : "var(--success)"
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.phone || "-"}</td>
                    <td>
                      <span className={`status-badge ${user.isActive ? "status-active" : "status-closed"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className={`btn btn-sm ${user.isActive ? "btn-warning" : "btn-success"}`}
                          onClick={() => toggleActive(user._id)}
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(user._id, user.name)}
                          title="Delete"
                        >
                          <FaTrash />
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
  );
};

export default ManageUsers;
