import React, { useState, useEffect } from 'react';
import { Connection, DatabaseType } from '../types/Connection';
import { X, Eye, EyeOff, Database, Key, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PasswordUpdateModalProps {
  isOpen: boolean;
  connection: Connection | null;
  onClose: () => void;
  onUpdate: (connectionId: string, newPassword: string) => void;
}

const defaultPorts = {
  PostgreSQL: 5432,
  MySQL: 3306,
  Oracle: 1521,
};

export const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({
  isOpen,
  connection,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    type: 'PostgreSQL' as DatabaseType,
    host: '',
    port: 5432,
    databaseName: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<'success' | 'error' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (connection) {
      setFormData({
        type: connection.type,
        host: connection.host,
        port: connection.port,
        databaseName: connection.databaseName,
        username: connection.username,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [connection]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !connection) return;

    setIsUpdating(true);
    setUpdateResult(null);

    // Simulate password update process
    setTimeout(() => {
      // Simulate success/failure based on form validation
      const success = formData.currentPassword && formData.newPassword && formData.newPassword === formData.confirmPassword;
      
      if (success) {
        setUpdateResult('success');
        onUpdate(connection.id, formData.newPassword);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setUpdateResult('error');
      }
      
      setIsUpdating(false);
    }, 2000);
  };

  const handleClose = () => {
    setFormData({
      type: 'PostgreSQL',
      host: '',
      port: 5432,
      databaseName: '',
      username: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswords({ current: false, new: false, confirm: false });
    setUpdateResult(null);
    setErrors({});
    onClose();
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!isOpen || !connection) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Update Database Password</h2>
                <p className="text-blue-100 text-sm">Change password for {connection.connectionName}</p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-white hover:text-white/90 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Connection Info (Read-only) */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Connection Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-600">Database Type</label>
                <div className="font-medium text-gray-900">{formData.type}</div>
              </div>
              <div>
                <label className="text-gray-600">Host</label>
                <div className="font-medium text-gray-900">{formData.host}</div>
              </div>
              <div>
                <label className="text-gray-600">Port</label>
                <div className="font-medium text-gray-900">{formData.port}</div>
              </div>
              <div>
                <label className="text-gray-600">Database</label>
                <div className="font-medium text-gray-900">{formData.databaseName || 'Not specified'}</div>
              </div>
              <div className="col-span-2">
                <label className="text-gray-600">Username</label>
                <div className="font-medium text-gray-900">{formData.username}</div>
              </div>
            </div>
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Password Update
            </h3>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.currentPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Re-enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Update Result */}
          {updateResult && (
            <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${
              updateResult === 'success' 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {updateResult === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold">
                  {updateResult === 'success' 
                    ? 'Password updated successfully!' 
                    : 'Password update failed'
                  }
                </p>
                <p className="text-sm opacity-80">
                  {updateResult === 'success' 
                    ? 'Your database password has been changed.' 
                    : 'Please check your current password and try again.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Security Notice</p>
                <p>This will update the password stored in your local connection settings. Make sure the new password matches your actual database password.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUpdating}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isUpdating || updateResult === 'success'}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};