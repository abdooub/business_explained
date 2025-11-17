(function(){
  function slugify(s){ return String(s||'').toLowerCase().trim().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
  function underscored(s){ return String(s||'').trim().replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,''); }

  var imgMap = {
    t1: 'images/ebooks/t1.png',
    o1: 'images/ebooks/Organizational_Management_Explained.png',
    c1: 'images/ebooks/c1.png',
    b1: 'images/ebooks/b1.png',
    m1: 'images/ebooks/m1.png',
    ca1:'images/ebooks/ca1.png',
    s1: 'images/ebooks/s1.png',
    sm1:'images/ebooks/sm1.png',
    pim1:'images/ebooks/pim1.png',
    pm1: 'images/ebooks/pm1.png',
    hr1: 'images/ebooks/hr1.png',
    pack:'images/ebooks/all_pack.png'
  };

  function candidateImages(name, code){
    var base = 'images/ebooks/';
    var dash = slugify(name);
    var under = underscored(name);
    var out = [
      base + under + '.png',
      base + under + '.jpg',
      base + dash + '.png',
      base + dash + '.jpg',
      base + under + '.PNG',
      base + under + '.JPG',
      base + dash + '.PNG',
      base + dash + '.JPG',
      base + under + '.jpeg',
      base + dash + '.jpeg'
    ];
    if (code) {
      out.push(base + code + '.png', base + code + '.jpg', base + code + '.PNG', base + code + '.JPG', base + code + '.jpeg');
    }
    return out;
  }

  function setSrcWithFallback(img, candidates, fallback){
    var list = Array.isArray(candidates) ? candidates.slice() : [];
    function tryNext(){
      if (!list.length){ img.onerror = null; img.src = fallback; return; }
      var next = list.shift();
      img.onerror = tryNext; img.src = next;
    }
    try { console.debug('[image-candidates]', candidates); } catch(_) {}
    tryNext();
  }

  var catalog = {
    'Organizational Management Explained': {
      price: 29, pages: 359,
      desc: 'How to run and improve any organization, explained strategy by strategy across 359 pages of usable knowledge.',
      features: [
        'Explore Modern Management Strategies',
        'Strategic Planning, PM & HR Management, Operations and Quality Management',
        'Value Stream Mapping, SMART Goals, SWOT Analysis and more'
      ],
      aboutHtml:
        '<p>Whether you’re a seasoned manager, an aspiring leader, or a business student, <strong>Organizational Management Explained</strong> provides you with the tools and knowledge necessary to excel in the ever-evolving world of organizational management.</p>' +
        '<p><strong>Organizational Management Explained</strong> is an essential resource for understanding the intricacies of managing modern organizations. This comprehensive guide offers insights into various organizational structures and management styles, crucial for today’s dynamic business landscape.</p>' +
        '<p>Spanning a wide range of topics, this eBook covers everything from organizational structures, such as hierarchical and matrix setups, to project management methodologies like Agile and Scrum.</p>' +
        '<p>It delves into the nuances of human resource management, exploring innovative recruitment strategies, effective onboarding processes, and impactful leadership techniques. Additionally, the book addresses crucial aspects of risk management and change management, preparing you to navigate the complexities of organizational transformations.</p>',
      toc: [
        'Introduction',
        'Organizational Foundations',
        'Centralized vs. Decentralized Organizational Structures',
        'Hierarchical Structure',
        'Flat Structure (or Horizontal Structure)',
        'Matrix Structure',
        'Network Structure',
        'Divisional Structure',
        'Team-based Structure',
        'Project-based Structure',
        'Organizational Theory',
        'Classical Organizational Theory',
        'Key Principles of Classical Organizational Theory: An Analytical Overview',
        'Real-World Application of Classical Organizational Theory: Grounded in Practice',
        'Neoclassical Organizational Theory: A Progressive Paradigm',
        'Key Principles of Neoclassical Organizational Theory: An Analytical Overview',
        'Real-World Application of Neoclassical Organizational Theory',
        'Modern Organizational Theory: Charting New Territories',
        'Foundational Tenets of Modern Organizational Theory',
        'Modern Organizational Theory in Practice',
        'Organizational Management',
        'What is organizational management?',
        'Why is organizational management important?',
        'What are the key features of organization management?',
        'Organizational management styles',
        'Autocratic Management Style',
        'Advantages of Autocratic Management Style',
        'Critique of Autocratic Management Style',
        'Democratic Management Style',
        'Advantages of Democratic Management Style',
        'Critique of Democratic Management Style',
        'Transformational Management Style',
        'Advantages of Transformational Management Style',
        'Critique of Transformational Management Style',
        'Transactional Management Style',
        'Advantages of Transactional Management Style',
        'Critique of Transactional Management Style',
        'Laissez-Faire Management Style',
        'Advantages of Laissez-Faire Management Style',
        'Critique of Laissez-Faire Management Style',
        'Servant Leadership Management Style',
        'Characteristics of Servant Leadership Management Style',
        'Advantages of Servant Leadership Management Style',
        'Critique of Servant Leadership Management Style',
        'Paternalistic Management Style',
        'Characteristics of Paternalistic Management Style',
        'Advantages of the Paternalistic Management Style',
        'Critiques of the Paternalistic Management Style',
        'Bureaucratic Management Style',
        'Characteristics of the Bureaucratic Management Style',
        'Advantages of the Bureaucratic Management Style',
        'Critiques of the Bureaucratic Management Style',
        'Charismatic Management Style',
        'Characteristics of the Charismatic Management Style',
        'Advantages of the Charismatic Approach',
        'Critiques of the Charismatic Management Style',
        'Collaborative Management Style',
        'Characteristics of the Collaborative Management Style',
        'Advantages of the Collaborative Approach',
        'Critique of the Collaborative Style',
        'Agile Management Style',
        'Characteristics of the Agile Management Style',
        'Advantages of the Agile Approach',
        'Critique of the Agile Style',
        'Cross-Functional Management Style',
        'Characteristics of the Cross-Functional Management Style',
        'Advantages of the Cross-Functional Approach',
        'Critique of the Cross-Functional Style',
        'Outcome-Based Management Style',
        'Characteristics of the Outcome-Based Management Style',
        'Advantages of the Outcome-Based Approach',
        'Critique of the Outcome-Based Style',
        'Participative Management Style',
        'Characteristics of the Participative Management Style',
        'Advantages of the Participative Approach',
        'Critique of the Participative Style',
        'Ethical Management Style',
        'Characteristics of the Ethical Management Style',
        'Advantages of the Ethical Approach',
        'Critique of the Ethical Style',
        'Coaching Management Style',
        'Characteristics of the Coaching Management Style',
        'Advantages of the Coaching Management Style',
        'Critique of the Coaching Management Style',
        'HR Management',
        'Talent Acquisition and Recruitment',
        'Inbound Recruitment',
        'Engaging Storytelling in Job Descriptions',
        'Dynamic Employer Branding',
        'Interactive Recruitment Campaigns',
        'Employee Advocacy and Referral Programs',
        'Content Marketing for Recruitment',
        'Outbound Recruitment',
        'Headhunting for Specialized Roles',
        'Utilizing Recruitment Agencies',
        'Participating in Job Fairs and Networking Events',
        'Interview Tactics and Techniques',
        'Behavioral Interviewing',
        'Situational Interviewing',
        'Technical Interviewing',
        'Competency-Based Interviewing',
        'Interview Logistics and Preparation',
        'Situation, Task, Action, Result (STAR) Method',
        'Stress Interviewing',
        'Structured Interviewing',
        'Onboarding and Orientation',
        'Elevating the Onboarding Experience',
        'Structuring the Onboarding Journey',
        'Customizing the Onboarding Process',
        'Remote Onboarding Strategies',
        'Measuring Onboarding Effectiveness',
        'Strategic Planning',
        'Vision, Mission, and Values',
        'SMART Goals',
        'SWOT Analysis: Identifying Strengths, Weaknesses, Opportunities, and Threats',
        'PESTLE Analysis: Evaluating the Macro Environment',
        'Blue Ocean Strategy: Creating New Market Space',
        'Porter’s Generic Strategies: Competitive Advantage',
        'Growth Strategies: Market Penetration, Development, and Diversification',
        'Leadership and Decision Making',
        'Leadership vs. Management: Identifying the Differences',
        'Contingency Theories: Adapting Leadership to Situational Demands',
        'Emotional Intelligence in Leadership',
        'Creative Problem-Solving Techniques',
        'Project Management',
        'Key Principles of Project Management',
        'Project Life Cycle',
        'Project Management Methodologies',
        '5 Project Management Tools You Should Consider',
        'Product Management',
        'Product Manager vs Product Owner',
        'Product Development Life Cycle',
        'Value Stream Management (VSM)',
        'Value Stream Mapping Symbols',
        'Material Flow Symbols: Charting the Physical Pulse of Operations',
        'Information Flow Symbols: Decoding the Invisible Threads of Communication',
        'Value Stream Mapping vs. Six Sigma',
        'Incorporating Lean Principles into VSM',
        'Building a Value Stream Management Office (VSMO)',
        'Operations and Quality Management',
        'What is Quality?',
        'Quality Assurance vs. Quality Control',
        'Efficiency and Effectiveness in Operations',
        'Forecasting Techniques in Operations',
        'Managing Hybrid Operations: Navigating the Confluence of Goods and Services',
        'Strategies in Operations Management',
        'Supply-Chain Management',
        'Supply Chain Design and Planning',
        'Supply Chain Optimization: A Quest for Efficiency and Resilience',
        'Supplier Relationship Management: Building Strategic Partnerships',
        'Production Scheduling and Control: Orchestrating Operational Excellence',
        'Transportation Management: Driving Efficiency and Connectivity',
        'Supply Chain Management Strategies',
        'Demand-Driven Material Requirements Planning (DDMRP)',
        'Vendor Managed Inventory (VMI)',
        'Change Management',
        'Change Management as a Process',
        'The 7 R’s of Change Management: A Strategic Framework for Transformation',
        'Change Management Strategies',
        'Resistance Management',
        'Stakeholder Management',
        'Innovation Management',
        'Importance of Innovation in Business',
        'Types of Innovation',
        'The Innovation Matrix',
        'Management Implications',
        'The Future Organization',
        'How Organizations Affect Society',
        'The Future of Employee Benefits',
        'Companies Pioneering in Sustainability'
      ],
      keywords: ['organizational management','strategy','operations','hr','swot','smart goals','value stream mapping','ebook']
    },
    'Marketing Frameworks Explained': {
      price: 29, pages: 256,
      desc: 'What really works in marketing, explained framework by framework across 256 pages of usable knowledge.',
      features: [
        '28+ Marketing Frameworks',
        '50+ Examples, Real-world Insights',
        'From Fundamentals to Advanced Strategies'
      ],
      keywords: ['marketing','frameworks','examples','strategy','ebook']
    },
    'Strategic Management Explained': {
      price: 29,
      desc: 'Navigate the strategic journey using field-tested tools and examples from top companies.',
      features: [
        'Navigate the Strategic Journey',
        'Use PESTLE, Porter’s, SWOT, VRIO and more',
        'Examples From Top Companies'
      ],
      keywords: ['strategy','pestle','porter','swot','vrio','ebook']
    },
    'Entrepreneurship Explained': {
      price: 29,
      desc: 'Practical guide to turning ideas into scalable businesses with structure, strategy, and tools you can apply immediately.',
      features: [
        'Shape and validate your business ideas',
        'Build a solid business plan and funding strategy',
        'Hire, lead, and scale with proven frameworks'
      ],
      aboutHtml:
        '<h3>About this eBook</h3>' +
        '<p>Entrepreneurship Explained is your practical guide to turning ideas into scalable businesses. Whether you’re just starting out or already building momentum, this eBook gives you the structure, strategy, and real-world tools to move forward with clarity.</p>' +
        '<p>You’ll start by shaping your core idea, identifying market gaps, validating demand, and refining your concept for real-world fit. From there, you’ll learn how to craft a business plan that attracts funding, make smart financial decisions early, and lay the operational groundwork for growth.</p>' +
        '<p>But this isn’t just about getting started, it’s about building with purpose. You’ll learn how to position your offer, reach the right customers, and convert consistently. Inside, you’ll also find proven frameworks for hiring, leadership, and scaling – everything you need to stop guessing and start building like a founder.</p>',
      toc: [
        'Preface',
        'Chapter 1: Understanding Entrepreneurship',
        '1. The Essence of Entrepreneurship',
        '1.1 Decoding Entrepreneurship: What It Means and Why It Matters?',
        '1.2 The Entrepreneurial Spirit Defined',
        '1.3 Exploring Different Entrepreneurial and Entrepreneurship Types',
        '1.4 Are You Cut Out to Be Your Own Boss?',
        '1.5 Entrepreneur’s Story: From Humble Beginnings to Iconic Success',
        '2. Building the Mindset for Success',
        '2.1 Key Characteristics of Successful Entrepreneurs',
        '2.2 Cultivating Winning Entrepreneurial Habits',
        '2.3 The Power of Passion and Perseverance',
        '3. Spotting Opportunities and Validating Your Ideas',
        '3.1 Uncovering Needs and Market Gaps',
        '3.2 Evaluating Business Ideas for Viability: Is it a good fit?',
        '3.3 Tools to Analyze Opportunities Effectively',
        '3.4 A Real-life Case Study: From Need to Success',
        'Chapter 2: Developing a Business Idea',
        '1. Turning Ideas into Action',
        '1.1 Powerful Brainstorming Techniques',
        '1.2 Refining Your Idea for Maximum Impact',
        '1.3 Case Study: From Concept to Launch – How Airbnb Became a Billion-dollar Business',
        '1.4 The Entrepreneurial Journey Visualization',
        '1.5 Famous Entrepreneur Early Struggles',
        '2. Market Research: Knowing Your Business Landscape and Target Audience',
        '2.1 Understanding Market Dynamics: Trends and Forces',
        '2.2 Identifying Your Target Audience: Who Is Your Ideal Customer?',
        '2.3 Competitive Analysis: Who’s Who in the Zoo?',
        '2.4 Tools and Methods for Effective Market Research',
        '2.5 Competitive Analysis Example: The Case of the Aspiring Cupcake Entrepreneur',
        '3. Validating Your Idea',
        '3.1 Putting Your Idea to the Test',
        '3.2 Creating Prototypes and Minimum Viable Products (MVPs)',
        '3.3 The Power of Feedback Loops: Learn, Adapt, and Improve',
        '3.4 Real-world Validation Story: The Sticky Note Spark that Launched Evernote',
        '4. Pricing Essentials: Cracking the Code to Profitability',
        '4.1 Cost Analysis: Knowing Your Numbers',
        '4.2 Competitive Landscape: Navigating the Business Jungle Without Getting Eaten Alive',
        '4.3 Value Proposition: What Makes You Worth It?',
        '4.4 Pricing Strategies: Finding the Sweet Spot',
        '4.5 Psychological Pricing: The Power of Perception',
        'Chapter 3: Building a Winning Business Plan',
        '1. Blueprint for Success',
        '1.1 Why Do You Need a Business Plan?',
        '1.2 Setting Clear SMART Objectives for Your Business',
        '1.3 Expert Tips for Creating a Winning Business Plan',
        '2. Key Elements of a Winning Business Plan',
        '2.1 Executive Summary',
        '2.2 Company Description',
        '2.3 Market Analysis',
        '2.4 Marketing Plan',
        '2.5 Management Team',
        '2.6 Financial Projections',
        '2.7 Funding Request (if applicable)',
        '2.8 Additional Elements to Consider',
        '3. Business Plan Templates',
        '3.1 Crafting a Winning Tech Startup Business Plan',
        '3.2 Crafting a Winning Service-based Business Plan',
        '3.3 Crafting a Winning E-commerce Ventures Business Plan',
        '4. Business Plan Example: Bean There, Spilled That Coffee Shop',
        '5. Resources for Building Your Business Plan',
        'Chapter 4: Securing Funding',
        '1. Funding Options: Launching without Breaking the Bank',
        '1.1 Bootstrapping: Building from the Ground Up',
        '1.2 Debt Financing: Borrowing for Growth',
        '1.3 Equity Financing: Selling Ownership for Investment',
        '1.4 Choosing the Right Funding Mix',
        '1.5 Alternative Funding Options',
        '1.6 The Importance of Financial Projections',
        '2. Pitching to Investors: Captivating Your Audience and Securing Funding',
        '2.1 Crafting Your Pitch: The Art of Storytelling',
        '2.2 Investor Expectations: What Investors Look For',
        '2.3 Fundraising Success Stories: Inspiration for Aspiring Entrepreneurs',
        '2.4 Financial Freedom: Understanding Your Business Numbers',
        '2.5 Case Studies: Plan in Action – Funding Strategies for Global Expansion',
        'Chapter 5: Building Your Dream Team',
        '1. Hiring the Right People',
        '1.1 Identifying Key Roles',
        '1.2 Recruitment Strategies',
        '2. Creating a Winning Culture',
        '2.1 Fostering Innovation: Thinking Beyond the Status Quo',
        '2.2 Building Trust and Collaboration: A Team That Works Together, Wins Together',
        '2.3 Case Study: Culture-driven Success – Patagonia',
        '3. Leadership Tips to Steer Your Team to Success',
        '3.1 Lead by Example: Be the Walking, Talking Embodiment of Your Values',
        '3.2 Effective Communication: Bridging the Gap and Fostering Trust',
        '3.3 Inspirational Leadership Stories: Giants Whose Shoulders We Stand On',
        'Chapter 6: Marketing and Sales Strategies – Reaching Your Ideal Customers',
        '1. Marketing Alchemy: Formula for Sales Growth',
        '1.1 Identifying Your Ideal Customers: The Foundation of Your Strategy',
        '1.2 Building Brand Awareness: Leaving a Lasting Impression',
        '1.3 Marketing Essentials: Reach and Convert',
        '1.4 Digital Marketing: Mastering the Online Landscape',
        '1.5 Case Study: Dollar Shave Club – Viral Video Marketing Success',
        '2. Building a Strong Brand: The Cornerstone of Business Success',
        '2.1 Brand Identity and Positioning: Standing Out from the Crowd',
        '2.2 Consistency and Trust: The Pillars of a Powerful Brand',
        '2.3 Expert Insights on Branding: Crafting Your Unique Selling Proposition (USP)',
        '2.4 Venn Diagram: Focus on Your Strengths, Not Weaknesses',
        '3. The Conversion Code: How to Build Trust and Convert?',
        '3.1 Understanding the Sales Funnel: The Customer Journey',
        '3.2 Customer Relationship Management (CRM): Building Trust and Loyalty',
        '3.3 Real-life Success Stories: The Power of Networking – From Lone Wolf to Leader',
        'Chapter 7: Managing Operations – The Backbone of Business Success',
        '1. Operational Efficiency',
        '1.1 Streamlining Processes: Doing More with Less',
        '1.2 Inventory and Supply Chain Management: The Right Products, Right Time',
        '1.3 Case Study: Zappos – Operational Excellence',
        '2. Technology and Tools',
        '2.1 Essential Business Tools',
        '2.2 Automation and AI',
        '2.3 Expert Tips on Tech Adoption',
        '3. Financial Management',
        '3.1 Financial Side of Your Business',
        '3.2 Understanding Financial Statements',
        '3.3 Art of Creating a Solid Budget',
        '4. Risk Management: Safeguarding Your Business',
        '4.1 How to Identify Potential Risk',
        '4.2 Assess Risk Likelihood and Impact',
        '4.3 Strategies to Mitigate Risk',
        '5. Deconstructing Success: Real-world Examples for Entrepreneurs',
        '5.1 Tech-savvy Businesses: Mastering the Digital Age',
        '5.2 Lean Operations Success: Doing More with Less',
        '5.3 Innovative Solutions in Operations: Redefining the Game',
        'Chapter 8: Scaling Your Business – Strategies for Sustainable Growth',
        '1. Growth Strategies',
        '1.1 Market Expansion: Reaching New Horizons',
        '1.2 Mergers and Acquisitions',
        '1.3 Franchising and Licensing',
        '1.4 Product Diversification: Broadening Your Appeal',
        '1.5 Customer Retention and Loyalty Programs',
        '1.6 Success Story in Scaling: Apple – A Masterclass in Scaling',
        '2. Managing Growth: Scaling Your Business Effectively',
        '2.1 Infrastructure and Resources: Building a Strong Foundation',
        '2.2 Handling Increased Demand: Keeping Up with the Flow',
        '2.3 Expert Advice on Scaling: From Startup to Enterprise',
        '3. Case Studies: Unveiling the Secrets of Growth',
        '3.1 Explosive Growth: Scaling at Breakneck Speed',
        '3.2 Sustainable Growth: Building for the Long Haul',
        '3.3 Lessons from Scaled Businesses',
        'Chapter 9: Overcoming Challenges',
        '1. Common Obstacles',
        '1.1 Financial Hurdles – Making the Money Flow',
        '1.2 Market Competition – Standing Out from the Crowd',
        '1.3 Attracting New Customers and Establishing a Loyal Customer Base',
        '2. Resilience and Adaptability in Business: Tips for Navigating the Entrepreneurial Rollercoaster',
        '2.1 Building Resilience: The Bounce-back Factor',
        '2.2 Adapting to Change: Succeeding in a Dynamic Landscape',
        '2.3 Inspiration from Real-world Entrepreneurs: Stories of Overcoming Adversity',
        '2.4 The Power of Persistence: How Persistence Pays Off in Entrepreneurship',
        '3. E-commerce: Thriving in the Digital Marketplace',
        '3.1 Setting Up an Online Store: Your Digital Shopfront',
        '3.2 Optimizing Product Listings: The Art of Getting Found',
        '3.3 Managing Online Marketing Campaigns: Spreading the Word',
        '3.4 Fulfilling Orders Efficiently: Keeping the Wheels Turning',
        '3.5 Common E-commerce Mistakes: Learning from Others’ Missteps',
        '4. Case Studies in Business Resilience',
        '4.1 Rising from the Ashes',
        '4.2 Turning Setbacks into Stepping Stones',
        '4.3 Learning from the Falls: Wisdom from Failures',
        'Chapter 10: Real-life Entrepreneurial Success Stories',
        '1. Inspiring Case Studies',
        '1.1 Tech Titans: Shaping the E-commerce Firmament',
        '1.2 Innovative Startups: Disrupting the Established Order',
        '1.3 Social Entrepreneurs: Weaving Social Good',
        '2. Unveiling the Gems: Wisdom from Business Victories',
        '2.1 Crystallizing Learnings: Key Takeaways from Success Stories',
        '2.2 Bridging the Gap: Applying Lessons to Your Business',
        '2.3 Expert Reflections on Success',
        '3. Facts, Stats, and Inspiration: Did you know?',
        '3.1 Interesting Entrepreneurial Facts',
        '3.2 Motivational Metrics: Inspiring Business Growth',
        '3.3 Words of Wisdom: Inspirational Quotes from Entrepreneurs',
        'Chapter 11: Conclusion',
        '1. Recap and Encouragement for Your Business Adventure',
        '1.1 Key Takeaways',
        '1.2 The Power of Belief: Embracing the Entrepreneurial Spirit',
        '1.3 Reflecting on Your Entrepreneurial Journey',
        '2. Take Action and Ignite Your Entrepreneurial Journey',
        '2.1 Guidance on Moving Forward: Take the First Step Toward Your Dream',
        '2.2 Continuous Learning: Essential Resources for Aspiring Entrepreneurs',
        '2.3 Planning Your Next Venture',
        '3. Final Thoughts',
        '3.1 Inspirational Closing Remarks',
        '3.2 Motivational Takeaways',
        'Bibliography'
      ],
      keywords: ['entrepreneurship','startup','business plan','funding','scaling','ebook']
    },
    'Process Improvement Strategies Explained': {
      price: 29, pages: 77,
      desc: '9 methodologies and 10 tools to improve processes, from Lean and Six Sigma to Kaizen and beyond.',
      features: [
        '9 Methodologies & 10 Tools for Process Improvement',
        'Lean, Six Sigma, Kaizen and more',
        'From Fundamentals to Advanced Strategies'
      ],
      keywords: ['process improvement','lean','six sigma','kaizen','tools','ebook']
    },
    'Human Resources Explained': {
      price: 19, pages: 76,
      desc: 'Essential HR concepts with best practices from recruitment to retention, with real-world guidance.',
      features: [
        'Essential HR Concepts With Best Practices',
        'From Recruitment to Retention',
        'Real-world Guidance & Examples'
      ],
      keywords: ['human resources','recruitment','retention','hr','best practices','ebook']
    },
    'Leadership Strategies Explained': {
      price: 29, pages: 114,
      desc: 'Lead with confidence using 14+ proven strategies, examples, and a personalized development plan.',
      features: [
        '14+ Leadership Strategies',
        'Create a Personalized Development Plan',
        'Learn With Real-life Leadership Examples'
      ],
      keywords: ['leadership','development plan','examples','ebook']
    },
    'Negotiation Strategies Explained': {
      price: 29, pages: 64,
      desc: 'Master 15+ negotiation strategies to navigate complex talks and communicate with impact.',
      features: [
        '15+ Negotiation Strategies',
        'Navigate Complex Talks Confidently',
        'Master Communication for Success'
      ],
      keywords: ['negotiation','communication','strategy','ebook']
    },
    'Productivity Strategies Explained': {
      price: 29, pages: 79,
      desc: '14 productivity strategies distilled into actionable methods to save hours every week.',
      features: [
        '14 Productivity Strategies',
        'Save Hours Weekly With These Methods',
        'Hours of research simplified'
      ],
      keywords: ['productivity','time management','methods','ebook']
    },
    'Financial Management Explained': {
      price: 29, pages: 74,
      desc: '13 financial management strategies with the latest trends explained clearly and concisely.',
      features: [
        '13 Financial Management Strategies',
        'Stay Ahead With Latest Trends',
        'Hours of Research Simplified'
      ],
      keywords: ['finance','financial management','trends','ebook']
    },
    'Soft Skills Explained': {
      price: 29, pages: 76,
      desc: 'Build soft skills like active listening and emotional intelligence with practical techniques and methods.',
      features: [
        'Active Listening and Emotional Intelligence',
        'Techniques for Personal and Professional Growth',
        'Pomodoro, Eat the Frog, 2-Minute Rule and more'
      ],
      keywords: ['soft skills','emotional intelligence','productivity','ebook']
    },
    'Risk Management Explained': {
      price: 29, pages: 85,
      desc: 'Assess and mitigate risks using 9 methods including SWOT, Monte Carlo, and EMV.',
      features: [
        '9 Risk Analysis Methods',
        'SWOT, Monte Carlo, EMV and more',
        'Easy 1-click PDF Download'
      ],
      keywords: ['risk','monte carlo','emv','swot','ebook']
    },
    'Change Management Strategies Explained': {
      price: 29, pages: 97,
      desc: '10 strategies with a practical blueprint covering internal and external factors for successful change.',
      features: [
        '10 Change Management Strategies',
        'Change Management Blueprint, Internal & External factors',
        'Hours of Research Simplified'
      ],
      keywords: ['change management','blueprint','strategy','ebook']
    },
    '360-Degree Feedback Explained': {
      price: 19, pages: 45,
      desc: 'Complete 360-degree feedback guide covering design, ethics, and implementation in practice.',
      features: [
        'Complete 360-Degree Feedback Guide',
        'Design, ethics, and implementation',
        'HR principles in practice'
      ],
      keywords: ['360 feedback','hr','implementation','ebook']
    },
    'Talent Management & Onboarding Explained': {
      price: 29, pages: 38,
      desc: 'Plan, perform, and develop talent with effective onboarding from preboarding to assimilation.',
      features: [
        'Talent Management: Planning, Performance, Development',
        'Effective Onboarding: From Preboarding to Assimilation',
        'HR Principles in Practice'
      ],
      keywords: ['talent management','onboarding','hr','ebook']
    },
    'Performance Management Strategies Explained': {
      price: 29, pages: 68,
      desc: '17 strategies to improve performance, engagement, and productivity with real-world cases.',
      features: [
        '17 Performance Management Strategies',
        'Enhance Engagement and Productivity',
        'Real-world Case Studies Included'
      ],
      keywords: ['performance management','engagement','case studies','ebook']
    },
    'Brand Development Explained': {
      price: 29, pages: 58,
      desc: 'Master the five elements of a strong brand and design a complete strategy you can measure.',
      features: [
        'Master the 5 elements of a strong brand',
        'Design a comprehensive brand strategy',
        'Monitor your brands performance'
      ],
      keywords: ['brand','strategy','measurement','ebook']
    },
    'Ecommerce Explained': {
      price: 29, pages: 70,
      desc: 'Understand e-commerce models, distribution, and success factors with practical growth tactics.',
      features: [
        'E-commerce Business Models, Distribution, Success Factors',
        'Cross-selling, Upselling, and SMART Goals',
        'Hours of Research Simplified'
      ],
      toc: [
        'Introduction to e-commerce',
        'E-commerce business models',
        'Distribution and logistics',
        'Success factors and growth tactics',
        'Cross-selling and upselling',
        'SMART goals and performance metrics'
      ],
      keywords: ['ecommerce','business models','upselling','smart goals','ebook']
    },
    'Financial Crisis Explained': {
      price: 29, pages: 94,
      desc: 'All key factors of financial crises explained with timely guidance for todays environment.',
      features: [
        'All Factors of Financial Crises',
        'Must-have Guide for the Current Times',
        'Hours of Research Simplified'
      ],
      toc: [
        'Introduction: what is a recession?',
        'How recessions start and spread',
        'The business cycle and financial markets',
        'Historical perspective on major crises',
        'The 2007–08 crisis step by step',
        'Policy responses and lessons learned'
      ],
      keywords: ['financial crisis','economics','guide','ebook']
    },
    'Housing Crisis Explained': {
      price: 29, pages: 70,
      desc: 'Overview of the housing crisis with causes, impacts, and actionable solutions.',
      features: [
        'Overview of the Housing Crisis',
        'Causes, Impacts, Solutions',
        'Key Contributing Factors'
      ],
      keywords: ['housing','policy','real estate','ebook']
    },
    'Customer Relationship Explained': {
      price: 29, pages: 79,
      desc: '21 customer relationship strategies distilled for business enthusiasts to apply immediately.',
      features: [
        '21 Customer Relationship Strategies',
        'Must-have Guide for Business Enthusiasts',
        'Hours of Research Simplified'
      ],
      keywords: ['customer relationship','crm','strategy','ebook']
    },
    'Scrum Manual': {
      price: 19, pages: 40,
      desc: 'Master Scrum fundamentals for agile projects from sprint planning to daily scrums.',
      features: [
        'Master the Art of Scrum and Agile Projects',
        'Sprint Planning, Daily Scrums and more',
        'Hours of Research Simplified'
      ],
      keywords: ['scrum','agile','sprint planning','ebook']
    },
    'Kanban Manual': {
      price: 19, pages: 42,
      desc: 'Learn the Kanban workflow, cards, and rules with practical real-world examples.',
      features: [
        'Master the Art of Kanban',
        'Kanban Workflow, Kanban Cards, & Kanban Rules',
        'Filled With Real-world Examples'
      ],
      keywords: ['kanban','workflow','examples','ebook']
    },
    'Agile Manual': {
      price: 19, pages: 44,
      desc: 'Discover cutting-edge agile strategies for teams, roadmaps, planning, and scaling.',
      features: [
        'Discover Cutting Edge Strategies in Agile',
        'Agile Teams, Advanced Roadmaps, Planning, Scaling and more',
        'Hours of Research Simplified'
      ],
      keywords: ['agile','roadmaps','planning','scaling','ebook']
    },
    'Artificial Intelligence in Business Explained': {
      price: 29, pages: 75,
      desc: 'A comprehensive AI introduction covering ML, DL, NLP, computer vision, and real applications.',
      features: [
        'Comprehensive AI Introduction',
        'Machine and Deep Learning, NLP, Computer Vision',
        'AIs Potential Everyday Applications'
      ],
      keywords: ['ai','machine learning','deep learning','nlp','computer vision','ebook']
    },
    'Cyber Security Explained': {
      price: 29, pages: 69,
      desc: 'In-depth basics of cybersecurity including encryption, best practices, and insurance.',
      features: [
        'In-depth Cybersecurity Basics',
        'Encryption, Best Practices, Insurance',
        'Protect Against Online Threats'
      ],
      aboutHtml: '<h3>About Cyber Security Explained<\/h3>' +
        '<p>From types of cyber attacks and threats, to malware and virus protection, this book covers everything you need to know to protect yourself and your systems from cyber attacks. You will also learn about firewalls and network security, mobile device security, and the importance of keeping your systems up-to-date.<\/p>' +
        '<p>Additionally, this book explores the role of encryption, best practices, and cyber insurance in cyber security. You will also learn about cyber security risks for small businesses, and how to protect yourself from email scams, phishing attacks, and other common threats.<\/p>',
      toc: [
        'Introduction to Cyber Security',
        'Types of Cyber Attacks and Threats',
        'Understanding Malware and Virus Protection',
        'Protecting Your Computer and Network',
        'Securing Your Online Accounts',
        'Managing Passwords and Other Security Measures',
        'Safeguarding Your Personal Information',
        'Responding to Cyber Attacks',
        'Keeping Your Systems Up-to-Date',
        'Understanding Firewalls and Network Security',
        'Securing Your Mobile Devices',
        'Protecting Yourself from Social Engineering Attacks',
        'Understanding Encryption and Its Role in Cybersecurity (Symmetric and Asymmetric Encryption)',
        'Staying Safe on Public Wi-Fi Networks (What is Public Wi-Fi?, Dangers, How to Stay Safe)',
        'Understanding the Importance of Backing Up Your Data (Why, Types of Backup, Creating a Backup Plan)',
        'Understanding Cybersecurity Risks for Small Businesses',
        'Protecting Yourself from Email Scams and Phishing Attacks',
        'The Role of Cyber Insurance in Cyber Security',
        'Learning About Cyber Security for Home Automation and IoT Devices',
        'Understanding Cyber Security for Cloud Computing',
        'Protecting Your Privacy on Social Media (Apps, Suspicious Links, Password Changes)',
        'Cyber Security for Remote Workers',
        'Understanding Cyber Security for Cryptocurrency and Blockchain',
        'Cyber Security for Travelers',
        'The Future of Cyber Security and Emerging Trends',
        'Understanding the Role of Governments in Cybersecurity',
        'The Ethics of Cyber Security',
        'Cyber Security Resources and Further Reading',
        'Conclusion'
      ],
      keywords: ['cybersecurity','encryption','best practices','ebook']
    },
    'Machine Learning Explained': {
      price: 29, pages: 83,
      desc: 'ML fundamentals: key concepts, algorithms, data processing, and industry applications.',
      features: [
        'ML Fundamentals in-depth',
        'Key Concepts, Algorithms, Data Processing',
        'Applications Across Industries'
      ],
      keywords: ['machine learning','algorithms','data processing','ebook']
    },
    'Virtual Reality Explained': {
      price: 19, pages: 62,
      desc: 'VR and AR fundamentals with applications in gaming, education, and more.',
      features: [
        'VR and AR Basics in-depth',
        'Applications in Gaming, Education and more',
        'Hours of Research Simplified'
      ],
      keywords: ['virtual reality','augmented reality','applications','ebook']
    }
  };

  var metaDefaults = { sub: 'Digital download  Instant access' };

  function setMeta(name, content){
    if (!content) return;
    var m = document.querySelector('meta[name="'+name+'"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', name); document.head.appendChild(m); }
    m.setAttribute('content', content);
  }
  function setMetaProp(prop, content){
    if (!content) return;
    var m = document.querySelector('meta[property="'+prop+'"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('property', prop); document.head.appendChild(m); }
    m.setAttribute('content', content);
  }
  function setOrCreate(selector, attrs){
    var el = document.querySelector(selector);
    if (!el) { el = document.createElement('link'); document.head.appendChild(el); }
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs,k)) el.setAttribute(k, attrs[k]);
    return el;
  }

  function updateOgImage(src){
    if (!src) return;
    setMetaProp('og:image', src);
    setMeta('twitter:image', src);
  }

  function initProduct(resolved){
    var code = resolved.code;
    var name = resolved.name || 'Product';
    var price = resolved.price;
    var isBundle = (name === 'Everything Explained Bundle' || code === 'pack');

    var titleEl = document.getElementById('pd-title');
    var priceEl = document.getElementById('pd-price');
    var imgEl = document.getElementById('pd-image');
    var buyEl = document.getElementById('pd-buy');
    var subEl = document.getElementById('pd-sub');
    var descEl = document.getElementById('pd-desc');
    var pagesEl = document.getElementById('pd-pages');

    if (titleEl) titleEl.textContent = name;

    var fallbackSrc = imgMap[code] || imgEl.src;
    setSrcWithFallback(imgEl, candidateImages(name, code), fallbackSrc);
    imgEl.alt = name;

    var prod = catalog[name] || null;
    var computedPrice = prod && typeof prod.price === 'number' ? prod.price : price;
    var finalPrice = computedPrice || price || 29;

    if (priceEl) priceEl.textContent = finalPrice + '';
    if (buyEl) {
      buyEl.setAttribute('data-id', code);
      buyEl.setAttribute('data-name', name);
      buyEl.setAttribute('data-price', String(finalPrice));
      buyEl.textContent = 'Add to cart for ' + finalPrice + '';
    }

    if (name === 'Soft Skills Explained') {
      try {
        buyEl.classList.remove('add-to-cart');
        buyEl.classList.add('gumroad-button');
        buyEl.setAttribute('href', 'https://businessexplique.gumroad.com/l/SoftSkillsExplained');
        buyEl.removeAttribute('data-id');
        buyEl.removeAttribute('data-name');
        buyEl.removeAttribute('data-price');
        buyEl.textContent = 'Buy Now  ' + finalPrice + '';
      } catch(_) {}
    }

    if (!isBundle) {
      if (pagesEl) {
        var pagesWrap = pagesEl.parentElement && pagesEl.parentElement.parentElement;
        if (pagesWrap) pagesWrap.style.display = '';
        pagesEl.textContent = (prod && prod.pages) ? prod.pages : 70;
      }
      if (prod && Array.isArray(prod.features)) {
        var featList = document.querySelector('.pd-feature-list');
        if (featList) featList.innerHTML = prod.features.map(function(t){ return '<li>'+t+'</li>'; }).join('');
      }
      if (descEl && prod && prod.desc) {
        descEl.textContent = prod.desc;
      }
      // Extra "About" block and table of contents for all products
      var extraEl = document.getElementById('pd-extra');
      var tocSection = document.getElementById('pd-toc-section');
      var tocEl = document.getElementById('pd-toc');
      if (extraEl) {
        var safeName = (name || 'This eBook').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        var inner;
        if (prod && prod.aboutHtml) {
          inner = prod.aboutHtml;
        } else if (prod) {
          var safeDesc = (prod.desc || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          inner = safeDesc ? '<p>' + safeDesc + '<\/p>' : '';
        } else {
          inner = '';
        }
        if (inner) {
          extraEl.innerHTML =
            '<div class="about-wrapper">' +
              '<div class="about-header">' +
                '<span class="about-badge">' + safeName + '<\/span>' +
                '<h2 class="about-title">About this eBook<\/h2>' +
              '<\/div>' +
              '<div class="about-body">' + inner + '<\/div>' +
            '<\/div>';
        } else {
          extraEl.innerHTML = '';
        }
      }
      var tocSource = prod && Array.isArray(prod.toc)
        ? prod.toc
        : (prod && Array.isArray(prod.features) ? prod.features : null);
      if (tocSource && tocSection && tocEl) {
        tocSection.style.display = 'block';
        tocEl.innerHTML = tocSource.map(function(item){ return '<li>'+item+'</li>'; }).join('');
      }
      if (subEl) subEl.textContent = (prod && prod.sub) || metaDefaults.sub;
      if (priceEl) priceEl.textContent = finalPrice + '';
      if (buyEl && !buyEl.classList.contains('gumroad-button')) {
        buyEl.setAttribute('data-price', String(finalPrice));
        buyEl.textContent = 'Add to cart for ' + finalPrice + '';
      }
    }

    var url = location.href;
    var title = name + '  Business Explique';
    var desc = (prod && prod.desc) ? (prod.desc + ' Instant access.') : ((prod && prod.features ? prod.features.join('. ') : 'Premium digital product eBook by Business Explique.') + ' Instant access.');
    document.title = title;
    setMeta('description', desc);
    setMeta('keywords', [name].concat(prod && prod.keywords ? prod.keywords : ['digital product','ebook','business explained','business','explained','pdf ebook']).join(', '));
    setMetaProp('og:title', name);
    setMetaProp('og:description', desc);
    setMetaProp('og:type', 'product');
    setMetaProp('og:url', url);
    setMeta('twitter:title', name);
    setMeta('twitter:description', desc);
    setOrCreate('link[rel="canonical"]', { rel: 'canonical', href: url });

    updateOgImage(imgEl.src);
    imgEl.addEventListener('load', function(){ updateOgImage(imgEl.currentSrc || imgEl.src); }, { once: true });
    imgEl.addEventListener('error', function(){ updateOgImage(imgEl.src); }, { once: true });

    if (isBundle) {
      if (subEl) subEl.textContent = 'Digital bundle  Instant access  One-time payment';
      if (descEl) descEl.innerHTML = '<p>The Everything Explained Bundle is a comprehensive collection of business eBooks covering marketing, leadership, finance, technology and more. See the list of all items included below.</p>';
      try {
        if (pagesEl && pagesEl.parentElement) {
          pagesEl.parentElement.innerHTML = '<strong id="pd-pages">32</strong> Books';
        }
      } catch(_) {}
      var bundleEl = document.getElementById('bundle-section');
      var listEl = document.getElementById('bundle-items');
      var bundleBuy = document.getElementById('bundle-buy');
      var bundleBuyBottom = document.getElementById('bundle-buy-bottom');
      function localThumbs(title){ return candidateImages(title); }
      var items = [
        'Organizational Management Explained',
        'Entrepreneurship Explained',
        'Marketing Frameworks Explained',
        'Market Research Explained',
        'Strategic Management Explained',
        'Process Improvement Strategies Explained',
        'Project Management Explained',
        'Human Resources Explained',
        'Leadership Strategies Explained',
        'Negotiation Strategies Explained',
        'Productivity Strategies Explained',
        'Financial Management Explained',
        'Risk Management Explained',
        'Soft Skills Explained',
        'Change Management Strategies Explained',
        'Employee Engagement Strategies Explained',
        '360-Degree Feedback Explained',
        'Talent Management & Onboarding Explained',
        'Performance Management Strategies Explained',
        'Brand Development Explained',
        'Ecommerce Explained',
        'Financial Crisis Explained',
        'Housing Crisis Explained',
        'Customer Relationship Explained',
        'Scrum Manual',
        'Kanban Manual',
        'Agile Manual',
        'Artificial Intelligence in Business Explained',
        'Cyber Security Explained',
        'Machine Learning Explained',
        'Virtual Reality Explained'
      ];
      if (bundleEl && listEl) {
        bundleEl.style.display = 'block';
        listEl.innerHTML = items.map(function(t){
          return '\n          <div class="bundle-item" role="listitem">\n            <img class="thumb" alt="" data-title="'+t.replace(/&/g,'&amp;')+'" />\n            <div class="title">'+t+'</div>\n            <div class="price">29</div>\n          </div>\n        ';
        }).join('');
        listEl.querySelectorAll('img.thumb').forEach(function(im){
          var t = im.getAttribute('data-title') || '';
          setSrcWithFallback(im, localThumbs(t), 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=160&q=70&auto=format&fit=crop');
        });
        var noteEl = document.getElementById('bundle-note');
        if (noteEl) noteEl.style.display = 'block';
        var fillBtn = function(btn){ if (!btn) return; btn.setAttribute('data-id', code); btn.setAttribute('data-name', name); btn.setAttribute('data-price', String(finalPrice)); btn.textContent = 'Add to cart  '+finalPrice+''; };
        fillBtn(bundleBuy);
        fillBtn(bundleBuyBottom);
      }
    }

    var ld = {
      '@context':'https://schema.org',
      '@type':'Product',
      'name': name,
      'image': [ document.getElementById('pd-image').src ],
      'description': desc,
      'brand': { '@type':'Organization', 'name':'Business Explique' },
      'url': url,
      'offers': {
        '@type':'Offer',
        'priceCurrency':'EUR',
        'price': String(finalPrice),
        'availability':'https://schema.org/InStock',
        'url': url
      }
    };
    var scriptLd = document.createElement('script');
    scriptLd.type = 'application/ld+json';
    scriptLd.textContent = JSON.stringify(ld);
    document.head.appendChild(scriptLd);
  }

  function resolveFromProducts(list){
    var params = new URLSearchParams(location.search);
    var raw = params.get('id') || '';
    var byId = Object.create(null);
    var byCode = Object.create(null);
    (list || []).forEach(function(p){
      if (!p) return;
      if (typeof p.id !== 'undefined') byId[String(p.id)] = p;
      if (p.code) byCode[String(p.code)] = p;
    });

    var resolved = null;
    if (raw) {
      if (byId[raw]) resolved = byId[raw];
      else if (byCode[raw]) resolved = byCode[raw];
    }

    if (!resolved && params.get('name')) {
      resolved = {
        id: 0,
        code: raw || 'custom',
        name: params.get('name'),
        price: Number(params.get('price') || 0) || 29
      };
    }

    if (!resolved) {
      resolved = byCode['pack'] || list[0] || { id: 0, code: 'product', name: 'Product', price: 29 };
    }

    return {
      id: resolved.id,
      code: resolved.code || raw || 'product',
      name: resolved.name,
      price: resolved.price
    };
  }

  function bootstrap(){
    fetch('products.json', { cache: 'no-cache' })
      .then(function(r){ return r.json(); })
      .then(function(list){
        var resolved = resolveFromProducts(list);
        initProduct(resolved);
      })
      .catch(function(){
        var fallback = resolveFromProducts([]);
        initProduct(fallback);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
