import React, { useState, useEffect } from "react";
import { Connection, DatabaseType } from "../types/Connection";
import {
  X,
  Eye,
  EyeOff,
  Database,
  Key,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface PasswordUpdateModalProps {
  isOpen: boolean;
  connection: Connection | null;
  onClose: () => void;
  onUpdate: (connectionId: string, newPassword: string) => void;
}

export const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({
  isOpen,
  connection,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    type: "PostgreSQL" as DatabaseType,
    host: "",
    port: 5432,
    databaseName: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<"success" | "error" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (connection) {
      setFormData({
        type: connection.type,
        host: connection.host,
        port: connection.port,
        databaseName: connection.databaseName,
        username: connection.username,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [connection]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword) newErrors.newPassword = "New password is required";
    else if (formData.newPassword.length < 6) newErrors.newPassword = "Minimum 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (formData.currentPassword === formData.newPassword) newErrors.newPassword = "New password must differ from current";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !connection) return;
    setIsUpdating(true);
    setUpdateResult(null);
    setTimeout(() => {
      const success = formData.currentPassword && formData.newPassword === formData.confirmPassword;
      setUpdateResult(success ? "success" : "error");
      if (success) {
        onUpdate(connection.id, formData.newPassword);
        setTimeout(() => handleClose(), 2000);
      }
      setIsUpdating(false);
    }, 2000);
  };

  const handleClose = () => {
    setFormData({
      type: "PostgreSQL",
      host: "",
      port: 5432,
      databaseName: "",
      username: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({ current: false, new: false, confirm: false });
    setUpdateResult(null);
    setErrors({});
    onClose();
  };

  const toggleVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (!isOpen || !connection) return null;

  const renderPasswordInput = (label: string, value: string, onChange: (val: string) => void, error: string | undefined, field: "current" | "new" | "confirm") => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showPasswords[field] ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={`w-full px-3 py-2 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-300"}`}
        />
        <button
          type="button"
          onClick={() => toggleVisibility(field)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPasswords[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            <div>
              <h2 className="font-semibold">Update Password</h2>
              <p className="text-xs opacity-80">{connection.connectionName}</p>
            </div>
          </div>
          <button onClick={handleClose} className="hover:bg-white/10 rounded p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
            <div><span className="font-medium">Type:</span> {formData.type}</div>
            <div><span className="font-medium">Host:</span> {formData.host}</div>
            <div><span className="font-medium">Port:</span> {formData.port}</div>
            <div><span className="font-medium">DB:</span> {formData.databaseName}</div>
            <div className="col-span-2"><span className="font-medium">User:</span> {formData.username}</div>
          </div>

          <div className="space-y-3">
            {renderPasswordInput("Current Password", formData.currentPassword, (val) => setFormData((p) => ({ ...p, currentPassword: val })), errors.currentPassword, "current")}
            {renderPasswordInput("New Password", formData.newPassword, (val) => setFormData((p) => ({ ...p, newPassword: val })), errors.newPassword, "new")}
            {renderPasswordInput("Confirm Password", formData.confirmPassword, (val) => setFormData((p) => ({ ...p, confirmPassword: val })), errors.confirmPassword, "confirm")}
          </div>

          {updateResult && (
            <div className={`text-sm px-3 py-2 rounded-md flex items-center gap-2 ${updateResult === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {updateResult === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{updateResult === "success" ? "Password updated successfully." : "Password update failed."}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 text-sm py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
              disabled={isUpdating}
            >Cancel</button>
            <button
              type="submit"
              disabled={isUpdating || updateResult === "success"}
              className="flex-1 text-sm py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUpdating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Key className="w-4 h-4" />}
              {isUpdating ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};