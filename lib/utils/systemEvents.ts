export const triggerAlert = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const event = new CustomEvent('system-alert', { detail: { message, type } });
    window.dispatchEvent(event);
};
