import React, { useState, useEffect } from 'react';
import './SystemAlert.css';

interface Alert {
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning';
}

export const triggerAlert = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const event = new CustomEvent('system-alert', { detail: { message, type } });
    window.dispatchEvent(event);
};

const SystemAlert: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        const handleAlert = (e: CustomEvent) => {
            const newAlert = {
                id: Date.now(),
                message: e.detail.message,
                type: e.detail.type,
            };
            setAlerts(prev => [...prev, newAlert]);

            // Auto dismiss
            setTimeout(() => {
                setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
            }, 3000);
        };

        window.addEventListener('system-alert', handleAlert as EventListener);
        return () => window.removeEventListener('system-alert', handleAlert as EventListener);
    }, []);

    if (alerts.length === 0) return null;

    return (
        <div className="system-alert-container">
            {alerts.map(alert => (
                <div key={alert.id} className={`system-alert ${alert.type} fade-in`}>
                    <span className="alert-prefix">
                        [{alert.type === 'success' ? ' OK ' : alert.type === 'warning' ? 'WARN' : 'INFO'}]
                    </span>
                    {alert.message}
                </div>
            ))}
        </div>
    );
};

export default SystemAlert;
