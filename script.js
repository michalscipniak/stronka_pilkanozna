document.addEventListener('DOMContentLoaded', function() {
    
    function updateClock() {
        const now = new Date();
        const clock = document.getElementById('clock');
        if (clock) {
            const timeString = now.toLocaleTimeString('pl-PL');
            const dateString = now.toLocaleDateString('pl-PL');
            clock.textContent = `${timeString}, ${dateString}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

   
    if (!localStorage.getItem('visitCount')) {
        localStorage.setItem('visitCount', '0');
    }

    
    if (!sessionStorage.getItem('visitCounted')) {
        let visitCount = parseInt(localStorage.getItem('visitCount'));
        visitCount++;
        localStorage.setItem('visitCount', visitCount.toString());
        sessionStorage.setItem('visitCounted', 'true');
    }

    
    const visitCounterElement = document.getElementById('visit-counter');
    if (visitCounterElement) {
        visitCounterElement.textContent = localStorage.getItem('visitCount');
    }

    
    let totalSeconds = 0;
    let intervalId = null;
    const timeSpentElement = document.getElementById('time-spent');

    
    if (sessionStorage.getItem('totalTimeSpent')) {
        totalSeconds = parseInt(sessionStorage.getItem('totalTimeSpent'));
    } else {
        sessionStorage.setItem('totalTimeSpent', '0');
    }

    
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    
    function updateTimeSpent() {
        totalSeconds++;
        sessionStorage.setItem('totalTimeSpent', totalSeconds.toString());
        if (timeSpentElement) {
            timeSpentElement.textContent = formatTime(totalSeconds);
        }
    }

    
    intervalId = setInterval(updateTimeSpent, 1000);

    
    if (timeSpentElement) {
        timeSpentElement.textContent = formatTime(totalSeconds);
    }

    
    window.addEventListener('beforeunload', function() {
        clearInterval(intervalId);
        sessionStorage.setItem('totalTimeSpent', totalSeconds.toString());
    });
});