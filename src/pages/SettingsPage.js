import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

const SettingsPage = () => {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const navigate = useNavigate();

    // Fetch the email from localStorage if available
    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) setEmail(storedEmail);
    }, []);

    // Logout function to remove credentials and navigate to login page
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    // Handle Password Change
    async function handlePasswordChange() {
        try {
            const response = await fetch('http://localhost:5000/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, currentPassword, newPassword }),
            });

            const result = await response.json();

            // Check if password update was successful
            if (!response.ok) {
                setStatusMessage(`Password update failed: ${result.error || 'Invalid credentials.'}`);
                return;
            }

            setStatusMessage("Password updated successfully. Please log in again.");
            logout();
        } catch (error) {
            console.error("Error updating password:", error);
            setStatusMessage("Password update failed due to server error.");
        }
    }

    // Handle Account Deletion
    async function handleDeleteAccount() {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        try {
            const response = await fetch('http://localhost:5000/delete-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: currentPassword }), // Using currentPassword for confirmation
            });

            const result = await response.json();

            // Check if account deletion was successful
            if (!response.ok) {
                setStatusMessage(`Account deletion failed: ${result.error || 'Invalid credentials.'}`);
                return;
            }

            setStatusMessage("Account deleted successfully.");
            logout();
        } catch (error) {
            console.error("Error deleting account:", error);
            setStatusMessage("Account deletion failed due to server error.");
        }
    }

    return (
        <div className="settings-page">
            <h2>Settings Page</h2>

            {statusMessage && <p className="status-message">{statusMessage}</p>}

            {/* Change Password Section */}
            <div className="settings-section">
                <h3>Change Password</h3>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled // Email is retrieved from localStorage; disabling to prevent changes
                />
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button onClick={handlePasswordChange}>Update Password</button>
            </div>

            {/* Delete Account Section */}
            <div className="settings-section delete-account-section">
                <h3>Delete Account</h3>
                <p>To delete your account, please confirm your current password.</p>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <button className="delete-button" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
        </div>
    );
};

export default SettingsPage;
