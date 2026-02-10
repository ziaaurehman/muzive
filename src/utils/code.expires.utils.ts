export const calculateRemainingSelection = (otpExpiryTime: number) => {
    const now = Date.now();
    const difference = otpExpiryTime! - now;
    return Math.max(0, Math.floor(difference / 1000));
};

export const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};