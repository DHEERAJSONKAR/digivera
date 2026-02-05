import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import api from '../utils/api';
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CameraIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/me');
      console.log('Profile API response:', response.data);
      
      // Handle nested data structure: response.data.data or response.data
      const user = response.data.data || response.data.user || response.data;
      console.log('User data:', user);
      
      setUserData(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      showMessage('error', 'Name and email are required');
      return;
    }

    // Password validation if changing password
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        showMessage('error', 'Current password is required to set new password');
        return;
      }
      if (formData.newPassword.length < 6) {
        showMessage('error', 'New password must be at least 6 characters');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        showMessage('error', 'New passwords do not match');
        return;
      }
    }

    try {
      setUpdating(true);
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // Only include password fields if user wants to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await api.put('/me', updateData);
      console.log('Update profile response:', response.data);
      
      // Handle nested data structure: response.data.data or response.data.user
      const updatedUser = response.data.data || response.data.user || response.data;
      setUserData(updatedUser);
      
      // Update form with latest data
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      showMessage('success', response.data.message || 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/me');
      localStorage.removeItem('token');
      navigate('/register');
    } catch (error) {
      console.error('Error deleting account:', error);
      showMessage('error', 'Failed to delete account');
      setShowDeleteModal(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post('/me/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user data with new photo
      const photoUrl = response.data.data?.profilePhoto || response.data.profilePhoto;
      setUserData({ ...userData, profilePhoto: photoUrl });
      showMessage('success', 'Profile photo updated successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showMessage('error', error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async () => {
    if (!userData?.profilePhoto) return;

    try {
      setUploadingPhoto(true);
      await api.delete('/me/photo');
      setUserData({ ...userData, profilePhoto: null });
      showMessage('success', 'Profile photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      showMessage('error', 'Failed to delete photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getPlanBadge = (plan) => {
    if (plan === 'pro') {
      return (
        <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-full">
          PRO
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-full">
        FREE
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' 
              ? 'text-green-700 dark:text-green-400' 
              : 'text-red-700 dark:text-red-400'
            }>
              {message.text}
            </p>
          </div>
        )}

        {/* Account Overview Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl p-6 mb-6 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Profile Photo with Upload */}
              <div className="relative group">
                {userData?.profilePhoto ? (
                  <img
                    src={`http://localhost:5000${userData.profilePhoto}`}
                    alt={userData.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-white dark:border-gray-700 shadow-lg">
                    {userData?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                
                {/* Hover overlay with upload/delete buttons */}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-1">
                    <button
                      onClick={handlePhotoClick}
                      disabled={uploadingPhoto}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                      title="Upload photo"
                    >
                      <CameraIcon className="w-4 h-4 text-gray-700" />
                    </button>
                    {userData?.profilePhoto && (
                      <button
                        onClick={handleDeletePhoto}
                        disabled={uploadingPhoto}
                        className="p-1.5 bg-red-500/90 rounded-full hover:bg-red-600 transition-colors"
                        title="Delete photo"
                      >
                        <TrashIcon className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Loading spinner */}
                {uploadingPhoto && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <ArrowPathIcon className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {userData?.name || 'User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {userData?.email}
                </p>
                <div className="flex items-center gap-3">
                  {getPlanBadge(userData?.plan)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {new Date(userData?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            {userData?.plan === 'free' && (
              <button
                onClick={() => navigate('/subscription')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Plan Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Subscription Details
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Current Plan</span>
              <span className="font-semibold text-gray-900 dark:text-white uppercase">
                {userData?.plan || 'Free'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Scans per Month</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {userData?.plan === 'pro' ? 'Unlimited' : '1 scan'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Auto Monitoring</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {userData?.plan === 'pro' ? 'Active' : 'Not available'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 dark:text-gray-400">Risk Score</span>
              <span className={`font-semibold ${
                userData?.reputationScore >= 70 ? 'text-red-600 dark:text-red-400' :
                userData?.reputationScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {userData?.reputationScore || 0}/100
              </span>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <UserCircleIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Update Profile Information
            </h3>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Divider */}
            <div className="py-4">
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Leave password fields empty if you don't want to change your password
              </p>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter current password"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm new password"
              />
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={updating}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {updating ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">
              Danger Zone
            </h3>
          </div>
          <p className="text-sm text-red-700 dark:text-red-400 mb-4">
            Once you delete your account, there is no going back. All your data, scans, and alerts will be permanently deleted.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <TrashIcon className="w-5 h-5" />
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Account
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted from our servers.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
