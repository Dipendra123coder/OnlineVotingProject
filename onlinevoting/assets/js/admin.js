document.addEventListener('DOMContentLoaded', () => {
    // Admin Login
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value.trim();
            const errorMessage = document.getElementById('adminErrorMessage');

            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                localStorage.setItem('role', 'admin');
                window.location.href = 'admin-dashboard.html';
            } else {
                errorMessage.textContent = 'Invalid admin credentials!';
            }
        });
        return;
    }

    // Admin Dashboard
    const adminDashboard = document.querySelector('.admin-dashboard-container');
    if (adminDashboard) {
        const adminInfo = document.getElementById('adminInfo');
        const postSelect = document.getElementById('postSelect');
        const addPostForm = document.getElementById('addPostForm');
        const addCandidateForm = document.getElementById('addCandidateForm');
        const postTables = document.getElementById('postTables');
        const voterVoteList = document.getElementById('voterVoteList');
        const electionStatus = document.getElementById('electionStatus');
        const startElectionBtn = document.getElementById('startElection');
        const stopElectionBtn = document.getElementById('stopElection');
        const resetVotesBtn = document.getElementById('resetVotes');
        const logoutBtn = document.getElementById('adminLogoutBtn');

        if (localStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = 'admin-login.html';
            return;
        }

        adminInfo.textContent = `Logged in as: ${localStorage.getItem('adminUsername')}`;

        // Load posts and candidates
        let posts = JSON.parse(localStorage.getItem('posts')) || [
            { name: 'President', candidates: [{ name: 'Alice', votes: 0 }, { name: 'Bob', votes: 0 }] },
            { name: 'Vice President', candidates: [{ name: 'Charlie', votes: 0 }, { name: 'Dana', votes: 0 }] }
        ];
        updatePostSelect();
        updatePostTables();

        // Load voter votes
        const voterVotes = JSON.parse(localStorage.getItem('voterVotes')) || [];
        updateVoterVoteTable();

        // Add Post
        addPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const postName = document.getElementById('newPostName').value.trim();
            if (posts.some(p => p.name === postName)) {
                alert('Post already exists!');
                return;
            }
            posts.push({ name: postName, candidates: [] });
            localStorage.setItem('posts', JSON.stringify(posts));
            updatePostSelect();
            updatePostTables();
            addPostForm.reset();
        });

        // Add Candidate
        addCandidateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const postName = postSelect.value;
            const candidateName = document.getElementById('newCandidateName').value.trim();
            const post = posts.find(p => p.name === postName);
            if (post.candidates.some(c => c.name === candidateName)) {
                alert('Candidate already exists for this post!');
                return;
            }
            post.candidates.push({ name: candidateName, votes: 0 });
            localStorage.setItem('posts', JSON.stringify(posts));
            updatePostTables();
            addCandidateForm.reset();
        });

        // Election Controls
        let isElectionRunning = localStorage.getItem('electionRunning') === 'true';
        electionStatus.textContent = `Election Status: ${isElectionRunning ? 'Running' : 'Stopped'}`;

        startElectionBtn.addEventListener('click', () => {
            isElectionRunning = true;
            localStorage.setItem('electionRunning', 'true');
            electionStatus.textContent = 'Election Status: Running';
        });

        stopElectionBtn.addEventListener('click', () => {
            isElectionRunning = false;
            localStorage.setItem('electionRunning', 'false');
            electionStatus.textContent = 'Election Status: Stopped';
        });

        resetVotesBtn.addEventListener('click', () => {
            if (confirm('Reset all votes? This cannot be undone.')) {
                posts.forEach(p => p.candidates.forEach(c => c.votes = 0));
                localStorage.setItem('posts', JSON.stringify(posts));
                localStorage.removeItem('votedPosts');
                localStorage.removeItem('votedVoters');
                localStorage.removeItem('voterVotes'); // Clear voter logs
                updatePostTables();
                updateVoterVoteTable();
                alert('Votes reset successfully!');
            }
        });

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUsername');
            localStorage.removeItem('role');
            window.location.href = 'admin-login.html';
        });

        // Update post select dropdown
        function updatePostSelect() {
            postSelect.innerHTML = '<option value="">Select Post</option>' + 
                posts.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
        }

        // Update post tables
        function updatePostTables() {
            postTables.innerHTML = posts.map(p => `
                <h3>${p.name}</h3>
                <table>
                    <thead><tr><th>Name</th><th>Votes</th><th>Action</th></tr></thead>
                    <tbody>
                        ${p.candidates.map(c => `
                            <tr>
                                <td>${c.name}</td>
                                <td>${c.votes}</td>
                                <td><button onclick="deleteCandidate('${p.name}', '${c.name}')">Delete</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `).join('');
        }

        // Update voter vote table
        function updateVoterVoteTable() {
            voterVoteList.innerHTML = voterVotes.map(v => `
                <tr>
                    <td>${v.voterID}</td>
                    <td>${Object.entries(v.votes).map(([post, cand]) => `${post}: ${cand}`).join(', ')}</td>
                    <td>${new Date(v.timestamp).toLocaleString()}</td>
                </tr>
            `).join('');
        }

        // Delete candidate
        window.deleteCandidate = (postName, candidateName) => {
            const post = posts.find(p => p.name === postName);
            post.candidates = post.candidates.filter(c => c.name !== candidateName);
            localStorage.setItem('posts', JSON.stringify(posts));
            updatePostTables();
        };
    }
});