import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QualityControlIcon from '../assets/QualityControl.png';
import SafetyControlIcon from '../assets/SafetyControl.png';
import SolventRecoveryIcon from '../assets/SolventRecovery.png';
import SafetyAlertIcon from '../assets/SafetyAlert.png';
import ProductionIcon from '../assets/Production.png';
import IndustryIcon from '../assets/Industry.png';
import DataAnalyticsIcon from '../assets/DataAnalytics.png';
import BatchProcessingIcon from '../assets/BatchProcessing.png';
import './Sidebar.css';

const Sidebar = forwardRef(({ isOpen, onClose }, ref) => {
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleOutsideClick = useCallback((e) => {
        if (ref.current && e.target.classList.contains('sidebar')) {
            onClose();
        }
    }, [onClose, ref]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen, handleOutsideClick]);

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    return (
        <div ref={ref} className={`sidebar ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={onClose}>X</button>
            <ul>
                <li>
                    <Link to="/quality-control">
                        <img src={QualityControlIcon} alt="Quality Control" className="sidebar-icon" />
                        Quality Control
                    </Link>
                    <button onClick={() => toggleDropdown('qualityControl')} className="dropdown-toggle">▼</button>
                    {openDropdown === 'qualityControl' && (
                        <div className="dropdown">
                            <Link to="/quality-control/page1">Page1</Link>
                            <Link to="/quality-control/page2">Page2</Link>
                        </div>
                    )}
                </li>
                <li>
                    <Link to="/safety-control">
                        <img src={SafetyControlIcon} alt="Safety Control" className="sidebar-icon" />
                        Safety Control
                    </Link>
                    <button onClick={() => toggleDropdown('safetyControl')} className="dropdown-toggle">▼</button>
                    {openDropdown === 'safetyControl' && (
                        <div className="dropdown">
                            <Link to="/safety-control/page1">Page1</Link>
                            <Link to="/safety-control/page2">Page2</Link>
                        </div>
                    )}
                </li>
                <li>
                    <Link to="/solvent-recovery">
                        <img src={SolventRecoveryIcon} alt="Solvent Recovery" className="sidebar-icon" />
                        Solvent Recovery
                    </Link>
                    <button onClick={() => toggleDropdown('solventRecovery')} className="dropdown-toggle">▼</button>
                    {openDropdown === 'solventRecovery' && (
                        <div className="dropdown">
                            <Link to="/solvent-recovery/page1">Page1</Link>
                            <Link to="/solvent-recovery/page2">Page2</Link>
                        </div>
                    )}
                </li>
                <li>
                    <Link to="/safety-alert">
                        <img src={SafetyAlertIcon} alt="Safety Alert" className="sidebar-icon" />
                        Safety Alert
                    </Link>
                    <button onClick={() => toggleDropdown('safetyAlert')} className="dropdown-toggle">▼</button>
                    {openDropdown === 'safetyAlert' && (
                        <div className="dropdown">
                            <Link to="/safety-alert/page1">Page1</Link>
                            <Link to="/safety-alert/page2">Page2</Link>
                        </div>
                    )}
                </li>
                <li>
                    <Link to="/production">
                        <img src={ProductionIcon} alt="Production" className="sidebar-icon" />
                        Production
                    </Link>
                    <button onClick={() => toggleDropdown('production')} className="dropdown-toggle">▼</button>
                    {openDropdown === 'production' && (
                        <div className="dropdown">
                            <Link to="/production/page1">Page1</Link>
                            <Link to="/production/page2">Page2</Link>
                        </div>
                    )}
                </li>
                <li>
                    <Link to="/industry">
                        <img src={IndustryIcon} alt="Industry" className="sidebar-icon" />
                        Industry
                    </Link>
                    <button onClick={() => toggleDropdown('industry')} className="dropdown-toggle">▼</button>
                    {openDropdown === 'industry' && (
                        <div className="dropdown">
                            <Link to="/industry/page1">Page1</Link>
                            <Link to="/industry/page2">Page2</Link>
                        </div>
                    )}
                </li>
                <li>
                    <Link to="/data-analytics">
                        <img src={DataAnalyticsIcon} alt="Data Analytics" className="sidebar-icon" />
                        Data Analytics
                    </Link>
                    <button onClick={() => toggleDropdown('dataAnalytics')} className="dropdown-toggle">▼</button>
                    {openDropdown === 'dataAnalytics' && (
                        <div className="dropdown">
                            <Link to="/data-analytics/page1">Page1</Link>
                            <Link to="/data-analytics/page2">Page2</Link>
                        </div>
                    )}
                </li>
                <li>
                    <Link to="/batch-processing">
                        <img src={BatchProcessingIcon} alt="Batch Processing" className="sidebar-icon" />
                        Batch Processing
                    </Link>
                    <button onClick={() => toggleDropdown('batchProcessing')} className="dropdown-toggle">▼</button>
                    {openDropdown === 'batchProcessing' && (
                        <div className="dropdown">
                            <Link to="/batch-processing/page1">Page1</Link>
                            <Link to="/batch-processing/page2">Page2</Link>
                        </div>
                    )}
                </li>
                <li>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </li>
            </ul>
        </div>
    );
});

export default Sidebar;
