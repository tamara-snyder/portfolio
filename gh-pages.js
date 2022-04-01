var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/tamara-snyder/portfolio.git', // Update to point to your repository  
        user: {
            name: 'Tamara Snyder', // update to use your name
            email: 'tamara.f.snyder@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)