document.addEventListener('DOMContentLoaded', () => {
    const voterInfo = document.getElementById('voterInfo');
    const voteStatus = document.getElementById('voteStatus');
    const logoutBtn = document.getElementById('logoutBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const totalCandidates = document.getElementById('totalCandidates');
    const totalVoters = document.getElementById('totalVoters');

    // Retrieve voter details from localStorage
    const voterName = localStorage.getItem('voterName');
    const voterID = localStorage.getItem('voterID');
    const votedPosts = JSON.parse(localStorage.getItem('votedPosts'));

    if (!voterName || !voterID) {
        voterInfo.innerHTML = 'You are not logged in! Redirecting to login...';
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    // Animated welcome message
    const welcomeMessage = `Welcome, ${voterName}<br>Voter ID: ${voterID}`;
    let charIndex = 0;
    voterInfo.innerHTML = '';
    const typeMessage = () => {
        if (charIndex < welcomeMessage.length) {
            voterInfo.innerHTML += welcomeMessage.charAt(charIndex);
            charIndex++;
            setTimeout(typeMessage, 50);
        }
    };
    setTimeout(typeMessage, 500);

    // Update voting status
    if (votedPosts && Object.keys(votedPosts).length > 0) {
        voteStatus.textContent = `You voted for: ${Object.entries(votedPosts).map(([post, cand]) => `${post}: ${cand}`).join(', ')}.`;
        voteStatus.style.color = '#27ae60';
        voteStatus.classList.add('voted');
    } else {
        voteStatus.textContent = 'You haven’t voted yet. Cast your vote now!';
    }

    // Calculate election progress
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const voterVotes = JSON.parse(localStorage.getItem('voterVotes')) || [];
    const registeredVoters = JSON.parse(localStorage.getItem('registeredVoters')) || [];
    const progress = (voterVotes.length / (registeredVoters.length || 1)) * 100;
    setTimeout(() => {
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    }, 500);
    progressText.textContent = `${Math.round(progress)}% of voters have participated.`;

    // Quick Stats
    const totalCandidatesCount = posts.reduce((sum, post) => sum + (post.candidates?.length || 0), 0);
    totalCandidates.textContent = totalCandidatesCount;
    totalVoters.textContent = voterVotes.length;

    // Animate stats counting
    const animateCount = (element, endValue, duration) => {
        let start = 0;
        const step = endValue / (duration / 50);
        const counter = setInterval(() => {
            start += step;
            if (start >= endValue) {
                start = endValue;
                clearInterval(counter);
            }
            element.textContent = Math.round(start);
        }, 50);
    };
    animateCount(totalCandidates, totalCandidatesCount, 2000);
    animateCount(totalVoters, voterVotes.length, 2000);

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('voterName');
        localStorage.removeItem('voterID');
        localStorage.removeItem('role');
        window.location.href = 'login.html';
    });

    // Optional: Simulate live updates (for demo purposes)
    setInterval(() => {
        const voterVotesUpdated = JSON.parse(localStorage.getItem('voterVotes')) || [];
        const progressUpdated = (voterVotesUpdated.length / (registeredVoters.length || 1)) * 100;
        progressFill.style.width = `${Math.min(progressUpdated, 100)}%`;
        progressText.textContent = `${Math.round(progressUpdated)}% of voters have participated.`;
        totalVoters.textContent = voterVotesUpdated.length;
        animateCount(totalVoters, voterVotesUpdated.length, 1000);
    }, 10000); // Update every 10 seconds
});