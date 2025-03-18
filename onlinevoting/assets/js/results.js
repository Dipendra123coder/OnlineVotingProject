document.addEventListener('DOMContentLoaded', () => {
    const resultsSections = document.getElementById('resultsSections');
    const totalVotesElement = document.getElementById('totalVotes');
    const leadingPostElement = document.getElementById('leadingPost');

    // Load posts and candidates from localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    console.log('Posts loaded for results:', posts);

    if (posts.length === 0) {
        resultsSections.innerHTML = '<p>No election results available yet.</p>';
        return;
    }

    // Calculate total votes and find leading candidates
    let totalVotes = 0;
    const leadingCandidates = {};

    posts.forEach(post => {
        const postVotes = post.candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
        totalVotes += postVotes;

        // Find leading candidate for this post
        const maxVotes = Math.max(...post.candidates.map(c => c.votes || 0));
        const leadingCandidate = post.candidates.find(c => c.votes === maxVotes) || { name: 'N/A', votes: 0 };
        leadingCandidates[post.name] = `${leadingCandidate.name} (${maxVotes} votes)`;
    });

    // Render results by post
    resultsSections.innerHTML = posts.map(p => {
        const maxVotes = Math.max(...p.candidates.map(c => c.votes || 0));
        return `
            <div class="post-result">
                <h3>${p.name}</h3>
                <table>
                    <thead>
                        <tr><th>Candidate</th><th>Votes</th></tr>
                    </thead>
                    <tbody>
                        ${p.candidates.map(c => `
                            <tr class="${c.votes === maxVotes && maxVotes > 0 ? 'leading' : ''}">
                                <td>${c.name}</td>
                                <td class="vote-count" data-votes="${c.votes || 0}">0</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }).join('');

    // Update summary
    totalVotesElement.textContent = totalVotes;
    leadingPostElement.textContent = Object.entries(leadingCandidates).map(([post, lead]) => `${post}: ${lead}`).join(', ');

    // Animate vote counters
    const voteCountElements = document.querySelectorAll('.vote-count');
    voteCountElements.forEach(element => {
        const endValue = parseInt(element.getAttribute('data-votes'), 10);
        let start = 0;
        const duration = 2000; // 2 seconds
        const step = endValue / (duration / 50);
        const counter = setInterval(() => {
            start += step;
            if (start >= endValue) {
                start = endValue;
                clearInterval(counter);
            }
            element.textContent = Math.round(start);
        }, 50);
    });
});