document.addEventListener('DOMContentLoaded', () => {
    const voteForm = document.getElementById('voteForm');
    const postSections = document.getElementById('postSections');
    const voteMessage = document.getElementById('voteMessage');

    console.log('vote.js loaded - DOM Content Loaded'); // Initial debug

    // Load posts and candidates from localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    console.log('Retrieved posts from localStorage:', posts); // Check data

    if (posts.length === 0) {
        voteMessage.textContent = 'No posts or candidates available! Please contact the admin.';
        voteForm.style.display = 'none';
        console.error('No posts found in localStorage');
        return;
    }

    // Check if voter is logged in
    const voterID = localStorage.getItem('voterID');
    console.log('Voter ID:', voterID); // Check voter ID
    if (!voterID) {
        voteMessage.textContent = 'Please log in first!';
        voteMessage.style.color = 'red';
        setTimeout(() => window.location.href = 'login.html', 2000);
        console.error('No voterID found');
        return;
    }

    // Check if voter has already voted
    const votedVoters = JSON.parse(localStorage.getItem('votedVoters')) || [];
    console.log('Voted Voters:', votedVoters);
    if (votedVoters.includes(voterID)) {
        voteMessage.textContent = 'You have already voted!';
        voteMessage.style.color = 'red';
        voteForm.style.display = 'none';
        console.log('Voter has already voted');
        return;
    }

    // Check election status
    const isElectionRunning = localStorage.getItem('electionRunning') === 'true';
    console.log('Election Running:', isElectionRunning);
    if (!isElectionRunning) {
        voteMessage.textContent = 'Voting is currently stopped by the admin.';
        voteMessage.style.color = 'red';
        voteForm.style.display = 'none';
        console.log('Election not running');
        return;
    }

    // Populate voting sections with candidate list
    let htmlContent = '';
    posts.forEach(p => {
        console.log(`Processing post: ${p.name}, Candidates:`, p.candidates); // Debug each post
        if (p.candidates && p.candidates.length > 0) {
            htmlContent += `
                <div class="post-section">
                    <h3>${p.name}</h3>
                    ${p.candidates.map(c => `
                        <label><input type="radio" name="${p.name.replace(/ /g, '_')}" value="${c.name}"> ${c.name}</label><br>
                    `).join('')}
                </div>
            `;
        } else {
            htmlContent += `<div class="post-section"><h3>${p.name}</h3><p>No candidates available for this post.</p></div>`;
            console.warn(`No candidates for post: ${p.name}`);
        }
    });
    postSections.innerHTML = htmlContent;
    console.log('Rendered HTML:', postSections.innerHTML); // Verify rendered output

    voteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted');

        const votes = {};
        let allSelected = true;
        posts.forEach(p => {
            const selectedCandidate = document.querySelector(`input[name="${p.name.replace(/ /g, '_')}"]:checked`);
            console.log(`Post: ${p.name}, Selected:`, selectedCandidate?.value);
            if (selectedCandidate) {
                votes[p.name] = selectedCandidate.value;
            } else {
                allSelected = false;
            }
        });

        if (!allSelected) {
            voteMessage.textContent = 'Please select a candidate for each post!';
            voteMessage.style.color = 'red';
            return;
        }

        posts.forEach(p => {
            const candidate = p.candidates.find(c => c.name === votes[p.name]);
            if (candidate) candidate.votes++;
        });
        localStorage.setItem('posts', JSON.stringify(posts));

        const voterVotes = JSON.parse(localStorage.getItem('voterVotes')) || [];
        voterVotes.push({ voterID, votes, timestamp: new Date().toISOString() });
        localStorage.setItem('voterVotes', JSON.stringify(voterVotes));

        votedVoters.push(voterID);
        localStorage.setItem('votedVoters', JSON.stringify(votedVoters));
        localStorage.setItem('votedPosts', JSON.stringify(votes));

        voteMessage.textContent = 'Your votes have been recorded!';
        voteMessage.style.color = 'green';
        setTimeout(() => window.location.href = 'results.html', 2000);
    });
});