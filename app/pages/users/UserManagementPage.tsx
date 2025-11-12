import React, { useEffect, useMemo, useState } from "react";
import type { User } from "../../types";
import {
  useMeQuery,
  useGetUnverifiedUsersQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useVerifyUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  type AppUser,
} from "~/services/finApi";
import { useBrandedModal } from "~/components/BrandedModal";

import UnverifiedUsers from "~/components/Users/UnverifiedUsers";
import AllUsersList from "~/components/Users/AllUsersList";
import RegisterForm from "~/components/Users/RegisterForm";
import EditUserModal from "~/components/Users/EditUserModal";
import ViewProfileModal from "~/components/Users/ViewProfileModal";
import { AdminGuard } from "~/components/AdminGuard";

const UserManagementPage: React.FC = () => {
  const { Modal, openAlert, openConfirm } = useBrandedModal();
  const { data: me } = useMeQuery();

  const skipAdmin = useMemo(() => me?.role !== "admin", [me?.role]);
  const { data: unverifiedUsers = [], isLoading: loadingUnverified } =
    useGetUnverifiedUsersQuery(undefined, { skip: skipAdmin });
  const { data: allUsers = [], isLoading: loadingUsers } = useGetUsersQuery(
    undefined,
    { skip: skipAdmin }
  );

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [verifyUser] = useVerifyUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    role: "viewer",
    isVerified: false,
  });
  const [viewingUser, setViewingUser] = useState<AppUser | null>(null);
  const [userSearch, setUserSearch] = useState("");

  // (optional) local storage current user
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem("fintechUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  // ---- Actions ----
  const confirmVerifyUser = (userId: string) => {
    if (me?.role !== "admin") return;
    openConfirm({
      title: "Verify this user?",
      message: (
        <>
          This will mark the account as verified and notify them by email.
          Proceed?
        </>
      ),
      confirmText: "Verify",
      cancelText: "Cancel",
      tone: "brand",
      onConfirm: async () => {
        await verifyUser({ id: userId, isVerified: true }).unwrap();
        openAlert("Success", "User verified and notified by email.", "brand");
      },
    });
  };

  const startEditUser = (user: AppUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name ?? "",
      role: user.role,
      isVerified: !!user.isVerified,
    });
  };

  const saveEditUser = async () => {
    if (!editingUser) return;
    try {
      await updateUser({ id: editingUser._id, data: editForm }).unwrap();
      setEditingUser(null);
      openAlert("Updated", "User details saved.", "brand");
    } catch {
      openAlert("Failed", "Could not update the user.", "danger");
    }
  };

  const confirmDeleteUser = (userId: string) => {
    if (me?.role !== "admin") return;
    openConfirm({
      title: "Delete user?",
      message: (
        <div>
          This action <strong>cannot be undone</strong>. Are you sure you want
          to delete this user?
        </div>
      ),
      confirmText: "Delete",
      cancelText: "Cancel",
      tone: "danger",
      onConfirm: async () => {
        try {
          await deleteUser(userId).unwrap();
          openAlert("Deleted", "User has been removed.", "brand");
        } catch {
          openAlert("Failed", "Could not delete this user.", "danger");
        }
      },
    });
  };

  const registerUser = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "viewer" | "editor" | "admin";
    country: string;
    organization?: string;
    jobTitle?: string;
    phoneNumber?: string;
  }) => {
    await createUser({
      name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      country: payload.country,
      organization: payload.organization,
      jobTitle: payload.jobTitle,
      phoneNumber: payload.phoneNumber,
    }).unwrap();
    openAlert("Success", "User registered successfully.", "brand");
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F8F6F3] flex flex-col">
        {Modal}

        <main className="flex-1 px-1 py-6 sm:py-10 space-y-6 sm:space-y-10 w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#6B3A1E] mb-2">
                User Management
              </h1>
              <p className="text-[#6B3A1E]/70 text-lg">
                Manage user accounts and permissions
              </p>
            </div>
          </div>

          {/* Unverified */}
          <section className="bg-white rounded-xl shadow-sm border border-[#D9CBBE] p-6 mb-8 w-full">
            <UnverifiedUsers
              loading={loadingUnverified}
              users={unverifiedUsers}
              onVerify={confirmVerifyUser}
            />
          </section>

          {/* All Users */}
          <section className="bg-white rounded-xl shadow-sm border border-[#D9CBBE] p-6 mb-6 w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#6B3A1E] mb-1">
                  All Users
                </h3>
                <p className="text-sm text-[#6B3A1E]/70">
                  Manage existing users and register new ones
                </p>
              </div>
              <div className="bg-[#E5B97C] text-[#6B3A1E] px-3 py-1 rounded-full text-sm font-medium">
                {allUsers.length} total users
              </div>
            </div>

            {/* <RegisterForm
              creating={creating}
              onValidateError={(title, msg) => openAlert(title, msg, "danger")}
              onSubmit={registerUser}
            /> */}

            <AllUsersList
              loading={loadingUsers}
              users={allUsers}
              search={userSearch}
              onSearch={setUserSearch}
              onView={(u) => setViewingUser(u)}
              onEdit={startEditUser}
              onDelete={(u) => confirmDeleteUser(u._id)}
            />
          </section>
        </main>

        {/* Modals */}
        <EditUserModal
          user={editingUser}
          form={editForm}
          setForm={setEditForm}
          onClose={() => setEditingUser(null)}
          onSave={saveEditUser}
        />
        <ViewProfileModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          onEdit={(u) => {
            setViewingUser(null);
            startEditUser(u);
          }}
        />
      </div>
    </AdminGuard>
  );
};

export default UserManagementPage;
