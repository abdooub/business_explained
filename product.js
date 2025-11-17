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
        '<strong>Part 1: Foundations of Organizational Management</strong>',
        '1. What is Organizational Management?',
        '2. Why Organizational Management Matters',
        '3. Key Features of Effective Organizational Management',
        '4. Organizational Theory: Classical, Neoclassical, Modern',
        '5. Structures and Design: Centralized vs Decentralized; Common structures (Hierarchical, Flat, Matrix, Network, Divisional, Team-based, Project-based)',
        '<strong>Part 2: Leadership and Management Styles</strong>',
        '6. Leadership vs Management: What’s the Difference?',
        '7. Core Leadership Traits and Competencies',
        '8. Management Styles: Autocratic, Democratic, Transformational, Transactional, Laissez-Faire, Servant Leadership, Paternalistic, Bureaucratic, Charismatic, Collaborative, Agile, Cross-Functional, Outcome-Based, Participative, Ethical, Coaching',
        '9. Contingency Theories: Adapting Style to Situation',
        '10. Emotional Intelligence in Leadership',
        '<strong>Part 3: Strategy and Planning</strong>',
        '11. Vision, Mission, and Values',
        '12. SMART Goals',
        '13. SWOT and PESTLE: Internal vs External Analysis',
        '14. Competitive Analysis and Porter’s Generic Strategies',
        '15. Blue Ocean Strategy: Creating Uncontested Space',
        '16. Growth Strategies: Market Penetration, Development, Diversification',
        '<strong>Part 4: Talent and HR Systems</strong>',
        '17. Talent Acquisition and Recruitment',
        '18. Inbound Recruitment: Story-Led JDs, Employer Branding, Interactive Campaigns, Advocacy/Referrals, Content Marketing',
        '19. Outbound Recruitment: Headhunting, Agencies, Fairs and Networking',
        '20. Interview Tactics: Behavioral, Situational, Technical, Competency-Based, STAR, Stress, Structured; Logistics and Prep',
        '21. Onboarding and Orientation: Experience Design, Journey Structure, Personalization, Remote Playbooks, Measuring Effectiveness',
        '<strong>Part 5: Projects and Products</strong>',
        '22. Project Management Principles',
        '23. Project Life Cycle: Initiation, Planning, Execution, Monitoring and Control, Closure',
        '24. Project Methodologies: Agile, Scrum, Waterfall, Kanban, Extreme Programming, Lean, Critical Path Method, PRINCE2, Rapid Application Development',
        '25. Choosing the Right Methodology',
        '26. Five Project Tools to Consider',
        '27. Product Manager vs Product Owner',
        '28. Product Development Life Cycle: Concept, Planning, Development, Testing, Launch, Evaluation',
        '29. Outcome-Driven Innovation, Lean Product Development, Agile Product Management',
        '<strong>Part 6: Operations, Value Streams, and Supply Chain</strong>',
        '30. Value Stream Management: Symbols (Process, Material, Information), Why VSM, VSM vs Six Sigma, Lean Integration, Aligning to Goals, VSM Office',
        '31. Operations and Quality: What is Quality, QA vs QC, Efficiency vs Effectiveness, Forecasting',
        '32. Theory of Constraints: Five Focusing Steps, Drum-Buffer-Rope, T/I/OE, Buffer Management',
        '33. Managing Goods, Services, and Hybrid Operations',
        '34. Operations Strategies: JIT, TQM, BPR, Lean, Six Sigma',
        '35. Supply Chain: Design and Planning, Inventory, Logistics and Distribution, Optimization, Supplier Relationships, Scheduling and Control, Warehouse, Transportation',
        '36. SCM Strategies: ABC Analysis, DDMRP, VMI, CPFR',
        '<strong>Part 7: Change, Negotiation, and Crisis</strong>',
        '37. Change Management Process: Preparation, Planning, Implementation, Consolidation',
        '38. The 7 Rs of Change',
        '39. Change Frameworks: Lewin, ADKAR, Kotter, McKinsey 7-S, Bridges, Kübler-Ross, Burke-Litwin',
        '40. Resistance and Stakeholder Management; Humanizing Change; Measuring Change Effectiveness',
        '41. Negotiations: Preparation and Planning',
        '42. Communication in Negotiation: Verbal and Non-Verbal; Active Listening and Questioning',
        '43. Negotiation Styles: Distributive, Integrative, Competitive, Collaborative, Avoidant, Compromise',
        '44. Conflict: Five Types and How to Address Them; Healthy vs Unhealthy Approaches',
        '45. Conflict Resolution Strategies: Collaboration, Compromise, Avoidance, Accommodation, Competition',
        '46. Crisis Management: Recovery Crisis vs Risk Management, Phases (Pre-Crisis, Response, Post-Crisis)',
        '47. Building a Crisis Strategy: Risk ID and Analysis, Proactive Plans, Resources, Communications, Evaluation and Feedback',
        '48. The Three Rs: Readiness, Response, Recovery',
        '<strong>Part 8: Innovation and the Future Organization</strong>',
        '49. Why Innovation Matters',
        '50. Types of Innovation: Product, Process, Marketing, Organizational',
        '51. Innovation Tools: Innovation Matrix, Growth-Share Matrix',
        '52. Disruptive vs Sustaining; Radical vs Incremental; Architectural vs Modular',
        '53. Measuring Innovation Success',
        '54. Innovation Case Studies: Airbus, Tesla, Netflix',
        '55. The Future Organization: Societal Impact, Global Trends, Creativity, Future of Benefits, Leaders in Sustainability'
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
      aboutHtml:
        '<p>With over 28+ marketing frameworks, <strong>Marketing Frameworks Explained</strong> is your comprehensive guide to mastering the art and science of marketing.</p>' +
        '<p>From fundamental concepts such as supply and demand, market research, and segmentation, to intricate frameworks like STP marketing models, Ansoff Matrix, and the Blue Ocean Strategy, this eBook covers it all.</p>' +
        '<p>Dive into real-world scenarios – with 50+ illustrations for clear, easy understanding.</p>' +
        '<p>It isn’t just about the theory; we’ve made sure to include content that guides you through implementing these frameworks, be it creating customer personas, devising a selling point, or adapting and evaluating your marketing strategies.</p>',
      toc: [
        'Introduction to marketing strategies',
        'Definition of marketing',
        'What marketing isn’t?',
        'What exactly is marketing strategy?',
        'Importance of marketing strategy',
        'Why do you need a marketing strategy?',
        'Impact on organisations and communication',
        'Understanding marketing basics',
        'Supply and demand',
        'Explaining demand',
        'Explaining supply',
        'Finding an equilibrium',
        'Theory or law?',
        'Market research',
        'Understanding market research',
        'Primary market research',
        'Secondary market research',
        'Types of market research',
        'Face-to-face interviews',
        'Focus groups',
        'Phone research',
        'Survey research',
        'Online market research',
        'How to do market research',
        'Benefits of market research',
        'Basics for the segmentation of industrial market',
        'Definition and foundations of industrial market segmentation',
        'Influence of industrial market segmentation on industrial marketing strategies',
        'Basics of product positioning',
        'Meaning of “product positioning”',
        'Positioning types',
        'Price',
        'Quality',
        'Differentiation',
        'Convenience',
        'Customer service',
        'Targeted customers',
        'Advantages of product positioning',
        'Relationship between the company and the market',
        'Finding your ideal customers',
        'Customer persona construction',
        'Making a selling point',
        'Formulating ad campaigns',
        'Promoting recognition and acceptance of your brand',
        'Evaluating and adapting',
        'Marketing mix and the 7P’s of marketing',
        '7Ps of marketing – understanding the concept',
        'Product (1st P)',
        'Price (2nd P)',
        'Place (3rd P)',
        'Promotion (4th P)',
        'People (5th P)',
        'Process (6th P)',
        'Physical evidence (7th P)',
        'Marketing mix process',
        'Marketing mix physical evidence',
        'SWOT Analysis',
        'Understanding SWOT analysis',
        'SWOT analysis key elements',
        'Strengths',
        'Weaknesses',
        'Opportunities',
        'Threats',
        'SWOT table',
        'How to do a SWOT analysis?',
        'STP Marketing Model',
        'What is STP marketing model?',
        'How does STP model work?',
        'STP marketing process',
        'Importance of the STP marketing model',
        'Examples of STP marketing models (Nike, McDonald’s, iPhone)',
        'Porter’s 5 Forces',
        'Understanding the Five Forces of Porter',
        'Industry competitiveness',
        'Potential for new competitors in an industry',
        'Supplier influence',
        'Customer power',
        'Threat of substitution',
        'What function do Porter’s Five Forces serve?',
        'Ansoff Matrix',
        'Understanding the Ansoff Matrix',
        'Market penetration',
        'Market development',
        'Product development',
        'Diversification',
        'BCG Growth-Share Matrix',
        'BCG Growth-Share Matrix: An overview',
        'Pets or dogs',
        'Cash cows',
        'Stars',
        'Question marks',
        'Limitations of the matrix',
        'BCG Growth-Share Matrix example',
        'AIDA Model',
        'AIDA Model hierarchy',
        'Attention',
        'Interest',
        'Desire',
        'Action',
        'New developments in the AIDA Model (AIDCAS, REAN, NAITDASE)',
        'Marketing Funnel',
        'Advantages of Marketing Funnels',
        'Kotler’s 5 A’s of Sales Marketing',
        'What are Kotler’s 5 A’s?',
        'Kotler’s 5 A’s customer path stages (Aware, Appeal, Ask, Act, Advocate)',
        'Blue Ocean Strategy',
        'PESTLE Analysis',
        'PESTLE Elements',
        'Pirate Metrics – AAARRR Framework',
        'Awareness',
        'Acquisition',
        'Activation',
        'Revenue',
        'Retention',
        'Referral',
        'Hook Model',
        'Hook Model: How does it operate? (Trigger, Action, Variable rewards, Investment)',
        'STEPPS Framework',
        'Social Currency',
        'Triggers and Emotions',
        'Public and Practical Value',
        'Stories',
        'Honeycomb Model',
        'Seven Social Media Honeycomb Components',
        'Implementing the Honeycomb Method in SMM',
        'Bullseye Marketing Framework',
        'Step 1: Consider your target audience',
        'Step 2: Review the traction channels in the Bullseye Framework',
        'Step 3: Monitor your customer acquisition cost',
        'When should you use the Bullseye Framework?',
        'RACE Model',
        'What does RACE stand for? (Plan, Reach, Act, Convert, Engage)',
        'Should you choose the RACE model?',
        'Lean Canvas Model',
        'Exploring the 9 key components of the Lean Canvas',
        'Problem',
        'Customer segments',
        'Unique value proposition',
        'Solution',
        'Channels',
        'Revenue streams',
        'Cost structure',
        'Key metrics',
        'Unfair advantage',
        'How to fill Lean Canvas?',
        'Pragmatic Marketing Framework',
        'Jobs-to-be-Done: A framework for customer needs',
        'Who are your customers?',
        'What types of jobs are they getting done?',
        'Customer’s desired outcomes',
        'What are the implications?',
        'Flywheel Model',
        'Flywheel Marketing Model benefits',
        'Components and advantages of the flywheel model',
        'Ways to use the flywheel model to deliver better customer experiences',
        'SERVQUAL Model of Service Quality',
        'History of the SERVQUAL Model',
        'SERVQUAL dimensions and gaps',
        'ZMOT / ZMOST framework',
        '5C Analysis (Company, Collaborators, Customers, Competitors, Context)',
        'Net Promoter Score (NPS)',
        'Using NPS and interpreting scores',
        'Content Marketing Matrix',
        'How the content matrix operates; axes and advantages',
        'Service-dominant logic',
        'Ten underlying assumptions of S-D logic',
        'Product Strategy and Management',
        'Product Life Cycle and stages',
        'Advantages of using the Product Life Cycle',
        'Target market and four target segmentations',
        'Product-market fit and how to achieve it',
        'Competitor analysis process',
        'Product positioning statement and its four parts',
        'BCG Matrix (definition, advantages, limitations, quadrants, strategies)',
        'GE-McKinsey Matrix (origins and strategic implications)',
        'Product positioning and USP (types, mapping)',
        'Choice of marketing channels (factors and product-related factors)',
        'Offline marketing channels',
        'Online marketing channels',
        'Emerging marketing channels',
        'KPIs for channel performance (CAC, CLV, conversion, retention, NPS, etc.)',
        'Marketing budgeting (factors, methods, allocation)',
        'International market (cultural, economic, legal/political factors; localization vs standardisation)',
        'Market entry strategies (exporting, licensing, franchising, JV, FDI, partnerships)',
        'Understanding consumer behavior (types, decision-making process)',
        'Conclusion'
      ],
      keywords: ['marketing','frameworks','examples','strategy','ebook']
    },
    'Market Research Explained': {
      price: 29,
      desc: 'Complete guide to modern market research: methods, frameworks, analytics, and strategic applications for TAM, SAM, SOM and pricing.',
      features: [
        'Foundations, methods and data collection',
        'Buyer personas, analytical frameworks and MVPs',
        'TAM/SAM/SOM, demand forecasting, pricing and KPIs'
      ],
      aboutHtml:
        '<p><strong>Market Research Explained</strong> is your all-in-one guide to understanding markets, customers, and data-driven decision making. From the fundamentals of market research to advanced analytical frameworks, this eBook walks you through every step of turning information into insight.</p>' +
        '<p>You will learn how to design and run qualitative and quantitative research, build effective buyer personas, leverage AI for next-generation research, and collect data using interviews, surveys, experiments, observational studies, big data, and more.</p>' +
        '<p>Beyond methods, the book shows you how to apply market research strategically: defining TAM/SAM/SOM, forecasting demand, shaping pricing models, and tracking the KPIs that matter for smarter decisions and better outcomes.</p>',
      toc: [
        'Introduction to Market Research',
        'Definition and importance of market research',
        'Different types of market research',
        'Understanding markets',
        'Understanding customers',
        'Market segmentation and demographics',
        'Industry valuation, trends, and flow',
        'Primary and secondary market research',
        'Comparing primary vs. secondary market research',
        'Advantages and limitations of each',
        'Consumer and business market research',
        'Difference between consumer (B2C) and business (B2B) market research',
        'Difference between B2C and B2B buyer personas',
        'Extending to B2B2C market research',
        'Examples of both types of buyer personas',
        'Qualitative vs. quantitative research',
        'Definitions and comparisons',
        'When to use qualitative or quantitative research',
        'How to analyze qualitative data',
        'Techniques for analyzing textual or visual data',
        'Software tools commonly used in qualitative analysis',
        'How to analyze quantitative data',
        'Statistical techniques and tools for data analysis',
        'Visualizing data for better insights',
        'AI powers the next generation of market research',
        'The power of AI in market research',
        'Benefits of AI-powered market research',
        'AI and traditional methods – a collaborative approach',
        'The future of market research',
        'Data collection methods',
        'Interviews and depth interviewing',
        'Surveys: design and implementation',
        'Experiments and field trials',
        'Observational research',
        'Polls: quick feedback on specific questions',
        'Longitudinal studies: tracking changes over time',
        'Case studies: in-depth study of a single subject or group',
        'Document and record review: analyzing existing data sources',
        'Big data: a flood of information, a sea of opportunity',
        'Focus groups',
        'When to use focus groups',
        'Planning and recruiting groups',
        'Areas of special consideration',
        'Moderating focus groups',
        'Analyzing focus group data',
        'Common challenges and solutions',
        'The buyer persona',
        'What is a buyer persona?',
        'Why buyer personas are important in marketing',
        'Key characteristics of an effective buyer persona',
        'Different types of buyer personas (bargain hunter, innovator, loyalist, eco-conscious shopper, practical purchaser, quality seeker, indecisive customer)',
        'How to create buyer personas',
        'Buyer persona template',
        'What is a negative buyer persona?',
        'Analytical frameworks',
        'SWOT analysis: strengths, weaknesses, opportunities, threats',
        'Competitor analysis: identifying and analyzing key competitors',
        'VRIO framework: value, rarity, imitability, organization',
        'PESTLE analysis: political, economic, social, technological, legal, environmental',
        'Porter’s Five Forces analysis',
        'BCG Matrix: portfolio management',
        'Ansoff Matrix: market development strategy',
        'Balanced Scorecard: performance measurement',
        'Value Chain Analysis: inbound logistics, operations, outbound logistics, marketing and sales, service',
        'Blue Ocean Strategy: creating new market space',
        'SEO research',
        'What is keyword research?',
        'Why keyword research is important',
        'Tools for keyword research (Google Analytics, Semrush, Ahrefs, Google Keyword Planner)',
        'Advanced keyword research techniques',
        'Long-tail keywords',
        'Competitor keyword analysis',
        'The Business Model Canvas',
        'Overview of the key building blocks',
        'Customer segments',
        'Value proposition',
        'Channels',
        'Customer relationships',
        'Revenue streams',
        'Key resources',
        'Key activities',
        'Key partnerships',
        'Cost structure',
        'Product development and innovation',
        'What is a Minimum Viable Product (MVP)?',
        'Defining your MVP',
        'Low-fidelity MVPs (concept, mock-ups, explainer videos, landing page MVPs)',
        'High-fidelity MVPs (single-feature, prototype, piecemeal, Wizard of Oz)',
        'Examples of successful MVPs',
        'Scaling from MVP to full product',
        'Using market research strategically',
        'Optimizing pricing strategies through market research',
        'Using market research to enter new markets',
        'Leveraging market research for new product/service launch',
        'Enhancing customer satisfaction through market research',
        'Total Addressable Market (TAM): defining and calculating',
        'Overview and definition of TAM',
        'Methods for calculating TAM (top-down, bottom-up, value theory, external research)',
        'Serviceable Available Market (SAM): identification and strategies',
        'Overview and definition of SAM',
        'Methods for calculating SAM',
        'Market segmentation analysis',
        'Geographic and demographic analysis',
        'Customer needs and usage patterns',
        'Strategies for targeting SAM (product differentiation, segmentation, competitive positioning)',
        'Serviceable Obtainable Market (SOM): estimation and utilization',
        'Overview and definition of SOM',
        'Methods for estimating SOM',
        'Conversion rate analysis',
        'Sales and distribution capacity analysis',
        'Competitor market share analysis',
        'Strategies for capturing SOM (partnerships, channels, retention programs)',
        'Demand forecasting: predicting market demand',
        'Expert opinion and Delphi method',
        'Time series analysis (trend, seasonal analysis)',
        'ARIMA models',
        'Econometric modeling (external variables)',
        'Bass Diffusion Model (for products with no historical data)',
        'Big data and AI for smarter demand prediction',
        'Value Chain Analysis (advanced)',
        'Key components of the value chain',
        'Conducting a value chain analysis',
        'Identifying value creation',
        'Optimizing the value chain',
        'Integrating value chain analysis with strategic planning',
        'Pricing models and strategies',
        'Why it’s crucial to get the price right',
        'Understanding price sensitivity through conjoint analysis',
        'What is a pricing matrix?',
        'Value-based pricing',
        'Competitive pricing',
        'Penetration pricing',
        'Dynamic pricing',
        'Geographic pricing',
        'Cost-plus pricing',
        'Bundle pricing',
        'How to choose the right pricing model for your business',
        'Market research key performance indicators (KPIs)',
        'Leading vs. lagging indicators in market research',
        'Response rates',
        'Survey completion rates',
        'Net Promoter Score (NPS)',
        'Margin of error',
        'Sample homogeneity',
        'Time to insight',
        'Cost per insight',
        'Return on research investment (RORI)',
        'Setting SMART KPIs',
        'Conclusion'
      ],
      keywords: ['market research','segmentation','buyer personas','analytics','frameworks','ebook']
    },
    'Strategic Management Explained': {
      price: 29,
      desc: 'Navigate the strategic journey using field-tested tools and examples from top companies.',
      features: [
        'Navigate the Strategic Journey',
        'Use PESTLE, Porter’s, SWOT, VRIO and more',
        'Examples From Top Companies'
      ],
      aboutHtml:
        '<p>In this eBook, you will learn about the stages of strategic management, including strategy formulation, implementation, and evaluation. Gain insights into various external and internal analysis techniques, such as PESTLE, Porter’s Five Forces, SWOT, and the VRIO framework. You’ll also explore various business-level and corporate-level strategies, including cost leadership, differentiation, and diversification.</p>' +
        '<p>Moreover, you’ll discover global strategies and how to implement and evaluate strategies effectively using organizational structure, leadership, and corporate culture. This eBook also features insightful case studies from leading companies like Apple, Amazon, Starbucks, and Tesla to provide real-world examples of strategic management in action.</p>',
      toc: [
        'Introduction to Strategic Management',
        'Defining Strategic Management',
        'The Importance of Strategic Management',
        'Stages of Strategic Management',
        'Strategy Formulation',
        'Strategy Implementation',
        'Strategy Evaluation and Control',
        'The Strategic Management Process',
        'Vision, Mission, and Goals',
        'External Analysis (overview)',
        'Internal Analysis (overview)',
        'Strategy Selection',
        'Strategy Execution',
        'External Analysis (detailed)',
        'PESTLE Analysis',
        'Industry Analysis: Porter’s Five Forces',
        'Competitive Analysis',
        'Scenario Planning',
        'Benchmarking',
        'Internal Analysis (detailed)',
        'SWOT Analysis',
        'Resource-Based View',
        'Value Chain Analysis',
        'Core Competencies',
        'VRIO Framework',
        'Financial Analysis',
        'Business-Level Strategies',
        'Cost Leadership',
        'Differentiation',
        'Focused Strategies',
        'Blue Ocean Strategy',
        'Corporate-Level Strategies',
        'Growth Strategies',
        'Stability Strategies',
        'Retrenchment Strategies',
        'Diversification',
        'Global Strategies',
        'Multidomestic Strategy',
        'Global Strategy',
        'Transnational Strategy',
        'Strategy Implementation',
        'Organizational Structure',
        'Leadership and Corporate Culture',
        'Strategic Change Management',
        'Strategy Evaluation and Control',
        'Key Performance Indicators (KPIs)',
        'Balanced Scorecard',
        'Strategic Control Systems',
        'Case Studies',
        'Apple Inc.: Innovation and Differentiation',
        'Amazon.com: Growth through Diversification',
        'Starbucks: Global Expansion',
        'Tesla: Disrupting the Automotive Industry',
        'The Future of Strategic Management',
        'Adapting to an Ever-Changing Business Environment',
        'Conclusion'
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
      aboutHtml:
        '<p>This essential resource will help you identify and prioritize process improvement opportunities, implement effective methodologies, and establish a culture of continuous improvement.</p>' +
        '<p>In this eBook, you will learn about the importance of process improvement, key principles, and various process improvement methodologies such as Lean, Six Sigma, Kaizen, and more. Additionally, you’ll explore 10 process improvement tools and techniques and delve into process mapping, root cause analysis, and change management.</p>',
      toc: [
        'Introduction',
        'What is process improvement?',
        'The importance of process improvement',
        'Key principles of process improvement',
        'Continuous improvement',
        'Waste reduction',
        'Standardization',
        'Customer focus',
        'Process improvement methodologies',
        'Lean',
        'Six Sigma',
        'Kaizen',
        'Business Process Re-engineering (BPR)',
        'Total Quality Management (TQM)',
        'Theory of Constraints (TOC)',
        'Design Thinking',
        'Hoshin Kanri (Policy Deployment)',
        'Balanced Scorecard',
        'Process mapping: understanding your current state',
        'Defining and setting process improvement goals',
        'Root cause analysis: identifying underlying issues',
        'Prioritizing process improvement initiatives',
        'Process improvement tools and techniques',
        'Value Stream Mapping',
        'Pareto Analysis',
        'Fishbone Diagram (Ishikawa Diagram)',
        '5 Whys',
        'Gemba Walk',
        'SIPOC Diagram (Suppliers, Inputs, Process, Outputs, Customers)',
        'Control Charts',
        'Failure Modes and Effects Analysis (FMEA)',
        'Benchmarking',
        'Brainstorming and Affinity Diagrams',
        'Implementing process improvement initiatives',
        'Change management: overcoming resistance and driving adoption',
        'Measuring the impact of process improvements',
        'Sustaining long-term process improvement',
        'Building a culture of continuous improvement',
        'Process improvement success stories and case studies',
        'Overcoming common process improvement challenges',
        'The future of process improvement: automation and emerging technologies',
        'Conclusion'
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
      aboutHtml:
        '<p>In this eBook, you’ll gain an in-depth understanding of the role of an HR professional and the importance of effective communication in HR. We cover the essential steps of the recruitment and selection process, from job posting to interview techniques, and show you how to evaluate candidates using behavioral, competency-based, panel, stress, structured, and unstructured interviews.</p>' +
        '<p>You’ll also dive into the most critical Human Resources Key Performance Indicators (KPIs), such as time-to-fill, cost-per-hire, voluntary turnover rate, and employee engagement survey scores, and learn how to measure and analyze them to improve recruitment and retention.</p>' +
        '<p>Beyond recruitment, the book explores succession planning, organizational culture, change management, collective bargaining, HRIS and analytics, global HR trends, and how emerging tools like ChatGPT can support modern HR management.</p>',
      toc: [
        'Introduction',
        'Unlocking the power of HR: understanding the role of an HR professional',
        'Key responsibilities of an HR professional',
        'Essential skills of an HR professional',
        'The overarching mission of an HR professional',
        'The value of an HR professional to an organization',
        'The cornerstone of HR success: effective communication',
        'Communication as a key component of the HR function',
        'Key areas of HR communication',
        'Mastering the art of recruitment and selection',
        'Job posting',
        'Sourcing candidates',
        'Resume screening',
        'Background and reference checks',
        'The interviewer’s toolkit: techniques for effective candidate evaluation',
        'Behavioral interviewing',
        'STAR method (Situation, Task, Action, Result)',
        'Competency-based interviewing',
        'Panel interviews',
        'Stress interviewing',
        'Structured interviewing',
        'Unstructured interviewing',
        'The metrics that matter: HR key performance indicators (KPIs)',
        'Time-to-fill',
        'Cost per hire',
        'Applicant-to-hire ratio',
        'Voluntary turnover rate',
        'Involuntary turnover rate',
        'Employee engagement survey scores',
        'Number of training hours per employee',
        'Percentage of employees participating in training',
        'Employee satisfaction survey scores',
        'Employee productivity rate',
        'Maximizing the potential of onboarding and orientation',
        'Pre-boarding',
        'Orientation',
        'Assimilation',
        'Training',
        'Follow-up',
        'Employee relations and conflict resolution (from conflict to collaboration)',
        'Navigating employee conflict',
        'Tools for successful conflict resolution',
        'Releasing the full potential of your team through performance management',
        'Performance appraisal',
        'Employee development and coaching',
        'Employee recognition and rewards',
        'Employee feedback',
        'Continuous performance management',
        'Managing underperforming employees',
        'Performance management systems',
        'Investing in employee development and training',
        'On-the-job training',
        'Mentoring',
        'Coaching',
        'E-learning and online training',
        'Classroom training',
        'Conferences and workshops',
        'Self-directed learning',
        'Job rotation',
        'Stretch assignments',
        'Cross-functional training',
        'Retaining talent: strategies for minimizing employee turnover',
        'Importance of employee retention',
        'Costs and consequences of high employee turnover',
        'Strategies for improving employee retention',
        'Using gap analysis to actualize your goals',
        'Identifying the gap',
        'Analyzing the gap',
        'Prioritizing the gap',
        'Developing a plan',
        'Monitoring and evaluating progress',
        'Crafting an irresistible compensation and benefits package',
        'Balanced and effective compensation structure',
        'Building fairness into compensation packages',
        'Regular evaluation and adaptation to meet employee expectations',
        'Safeguarding business success: legal compliance and regulations',
        'HR managers as guardians of compliance',
        'Effective policies and practices for legal compliance',
        'The DEI advantage: diversity, equality, and inclusion',
        'Understanding diversity in the workplace',
        'Promoting equality in the workplace',
        'Creating an inclusive workplace culture',
        'HR’s strategic role in DEI',
        'Employee engagement and wellness for business growth',
        'Fueling productivity and innovation',
        'Attracting and retaining top talent',
        'Bottom-line impact of engagement and wellness',
        'Employee handbooks, policies, and records management',
        'Designing policies for fairness, compliance, and well-being',
        'Managing records for efficiency and compliance',
        'Exit strategies: termination, exit interviews, and offboarding',
        'The art of termination',
        'The power of exit interviews',
        'Seamless offboarding',
        'The ROI of succession planning',
        'Essence of succession planning',
        'From identifying high-potential individuals to leadership excellence',
        'Building the unique organizational culture',
        'Key components of organizational culture',
        'Building and nurturing a positive organizational culture',
        'Guide to effective change management in business',
        'Significance of change management',
        'Change management process',
        'Approaches to change management',
        'Success factors in change management',
        'The power of collective bargaining',
        'Fundamentals of collective bargaining',
        'Key elements of collective bargaining',
        'Importance of collective bargaining',
        'Effective implementation of collective bargaining',
        'Modern HR management: HRIS and analytics',
        'Benefits of HRIS',
        'HR analytics and data-driven decision making',
        'Integrating HRIS and analytics',
        'Global perspective: future trends shaping HR',
        'HR management and globalization',
        'Talent management in a global context',
        'Technological revolution and the future of HR',
        'Leveraging ChatGPT in HR management',
        'ChatGPT for talent acquisition',
        'Empowering employee engagement with ChatGPT',
        'HR analytics and data-driven decision making with ChatGPT',
        'Conclusion',
        'References'
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
      aboutHtml:
        '<p>Starting with the basics, this eBook shows you why leadership matters in business and how to define it clearly. You will discover the key components of leadership, how it differs from management, and where the two overlap inside organisations.</p>' +
        '<p>You will then explore classic leadership theories – trait, behavioral, situational – and a wide range of leadership strategies including transformational, servant, authentic, emotionally intelligent, strategic, visionary, collaborative, agile, adaptive, ethical, and culturally intelligent leadership.</p>' +
        '<p>Because great leaders also negotiate, the book covers essential negotiation skills and strategies such as interest-based negotiation, BATNA, anchoring, win-win and integrative approaches, and the use of objective criteria. You will also learn how to lead change and manage remote teams effectively.</p>',
      toc: [
        'Introduction',
        'The importance of leadership in business',
        'Keeping the company true to its vision',
        'Motivating the team',
        'Facilitating the acceptance of diversity',
        'Disseminating emerging strategic goals',
        'Inspiring workers',
        'Access to resources and assistance',
        'Promoting continuous learning',
        'Creating a sense of belonging',
        'Defining leadership and its key components',
        'Understanding leadership',
        'Elements of a good leader',
        'Seven crucial components of corporate leadership (communication, observation, decisiveness, transparency, trust, confidence, charisma)',
        'Mastering the key elements of successful leadership',
        'Leadership vs. management',
        'The role of managers',
        'The role of leaders',
        'How management differs from leadership',
        'Managers carry out the vision created by leaders',
        'Managers focus on execution; leaders prioritize ideas',
        'Leaders motivate; managers ensure success',
        'Leaders look to the future; managers focus on the present',
        'Managers support the culture that leaders shape',
        'Areas where leadership and management intersect',
        'Trait Theory of Leadership',
        'Rationale for the trait theory of leadership',
        'Common leadership traits',
        'Controversies and limits of trait theory',
        'Behavioral theories of leadership',
        'Overview of behavioral theory',
        'Criticism of behavioral theory',
        'Ohio State studies',
        'Michigan studies',
        'Situational theories of leadership',
        'Situational Leadership Theory by Hersey and Blanchard',
        'Goleman’s situational leadership model (pacesetting, authoritative, affiliative, coaching, democratic, coercive)',
        'Normative Decision Theory',
        'Different leadership strategies and when to use them',
        'The visionary leader',
        'The coaching leader',
        'The transformational leader',
        'The servant leader',
        'The authentic leader',
        'The strategic leader',
        'The collaborative leader',
        'The ethical leader',
        'The agile leader',
        'Leader–member exchange (LMX) leadership',
        'The culturally intelligent leader',
        'The emotionally intelligent leader',
        'The transactional leader',
        'The adaptive leader',
        'Developing a leadership development plan',
        'Step 1: Assessing leadership needs and gaps',
        'Step 2: Developing a leadership development curriculum',
        'Step 3: Identifying development opportunities',
        'Step 4: Measuring progress',
        'Step 5: Sustaining leadership development',
        'Step 6: Testing leadership development',
        'Step 7: Maintaining leadership development',
        'Developing a leadership brand',
        'Why create your leadership brand?',
        'Being unique in the crowd',
        'Displaying your true self to the world',
        'Building credibility and trust',
        'Supporting your professional goals',
        'How to create your leadership brand (current brand, core values, feedback, impact, brand statement)',
        'Leveraging artificial intelligence in leadership',
        'AI for learning and development',
        'Automated decision making',
        'Pattern recognition',
        'Virtual support',
        'Sentiment analysis on social media',
        'Leading remote teams',
        'Building trust and connection with remote teams (12 tips)',
        'Communicating and collaborating effectively with remote teams',
        'Managing and motivating remote teams',
        'Leveraging technology for remote leadership (video/chat apps, cloud tools, virtual events)',
        'Measuring and improving performance of remote teams',
        'Choosing metrics for remote productivity',
        'Setting performance standards for remote workers',
        'Checking cultural engagement',
        'Defining communication criteria',
        'Tracking remote objectives',
        'Understanding challenges of remote leadership',
        'Effective communication skills for leaders',
        'Active listening',
        'Adapting communication style to the audience',
        'Clarity and conciseness',
        'Empathy',
        'Body language and non-verbal communication',
        'Confirming understanding',
        'Giving and receiving feedback',
        'Negotiation skills and strategies for leaders',
        'Interest-based negotiation',
        'BATNA',
        'Anchoring',
        'Win–win negotiation',
        'Integrative negotiation',
        'Using objective criteria',
        'Leading change',
        'How to lead change successfully (understand change, identify need, develop strategy, communicate, manage resistance, sustain change)',
        'Case studies of successful leadership (Adobe, Microsoft, Upwork, BetterUp, SAP)',
        'Conclusion'
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
      aboutHtml:
        '<p>Whether you’re negotiating a salary, a business deal, or resolving a conflict, this guide provides you with the essential skills and knowledge to succeed.</p>' +
        '<p>From understanding the negotiation process to dealing with power imbalances and ethical considerations, this eBook covers everything you need to know to become a skilled negotiator. You’ll learn how to prepare for a negotiation, communicate effectively, and use different strategies and techniques to achieve your goals.</p>' +
        '<p>With real-world examples and practical exercises, you’ll gain the confidence to negotiate in different situations, including cross-cultural and virtual negotiation. You’ll also discover how to handle emotions and close deals successfully.</p>',
      toc: [
        'Definition of negotiation',
        'Importance of negotiation skills',
        'Understanding the negotiating process',
        'Stages of negotiation',
        'Key elements of successful negotiation',
        'Preparing for negotiation',
        'Research and gathering information',
        'Defining negotiation objectives and strategies',
        'Identifying your BATNA (Best Alternative to a Negotiated Agreement)',
        'Communication skills in negotiation',
        'Active listening – definition and benefits',
        'Techniques for effective active listening',
        'Understanding nonverbal cues',
        'Interpreting body language in negotiation',
        'Importance of nonverbal communication in negotiation',
        'Effective negotiation language',
        'Using persuasive language in negotiation',
        'Avoiding communication pitfalls in negotiation',
        'Practicing negotiation communication skills',
        'Getting feedback and continuous improvement',
        'Overcoming communication barriers in negotiation',
        'Negotiation strategies and techniques',
        'Win–win negotiation',
        'Win–lose negotiation',
        'Lose–win negotiation',
        'Compromise negotiation',
        'Integrative negotiation',
        'Distributive bargaining',
        'Interest-based negotiation',
        'Collaborative negotiation',
        'Avoiding negotiation',
        'Concessional negotiation',
        'Problem-solving negotiation',
        'Competitive negotiation',
        'Accommodating negotiation',
        'Competing negotiation',
        'Split-the-difference negotiation',
        'Negotiation in different situations',
        'Negotiating with difficult people',
        'Negotiating with a team',
        'Cross-cultural negotiation',
        'Virtual negotiation',
        'Negotiating with superiors or subordinates',
        'Negotiating in a competitive market',
        'Negotiating with a long-standing business partner',
        'Negotiating under time pressure',
        'Negotiating with limited resources',
        'Negotiating with a customer or client',
        'Negotiating with multiple parties or stakeholders',
        'Negotiating in high-stakes or high-pressure situations',
        'Handling emotions in negotiation',
        'Impact of emotions on negotiation outcomes',
        'Controlling emotional responses in high-pressure situations',
        'Managing stress and anxiety in negotiation',
        'Dealing with anger and frustration',
        'Maintaining a positive attitude',
        'Dealing with power imbalances',
        'Identifying power imbalances',
        'Balancing power',
        'Leveraging power ethically',
        'Ethics in negotiation',
        'Fair negotiation',
        'Honesty and transparency',
        'Avoiding unethical negotiation tactics',
        'Closing the deal',
        'Agreement closing',
        'Making a written agreement',
        'Implementing and monitoring the agreement',
        'Summary of key negotiation skills, strategies, and tactics',
        'Importance of continuous learning and improvement',
        'Final thoughts and recommendations'
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
      aboutHtml:
        '<p>In an increasingly competitive and fast-paced world, productivity is the cornerstone of business success. <strong>Productivity Strategies Explained</strong> serves as your ultimate guide to unleashing productivity at both individual and organizational levels.</p>' +
        '<p>You’ll begin by understanding the psychology behind productivity and how it differs from mere performance. Discover proven techniques like the Pomodoro Technique, SMART Goals, mind mapping, deep work and the two-minute rule, plus advanced approaches such as Warren Buffett’s “2 List” strategy.</p>' +
        '<p>The eBook also dives into practical methods for measuring productivity, from quantitative approaches like ROI to qualitative methods such as employee satisfaction surveys. You’ll learn about tools for tracking productivity, and how to foster a culture of productivity in your workplace.</p>',
      toc: [
        'Introduction',
        'Defining productivity in a business context',
        'The psychology of productivity',
        'Productivity vs performance',
        'Aligning your mission and vision',
        'Setting the stage for a productive mindset',
        'Fundamental business productivity strategies',
        'The Pomodoro Technique',
        'Setting SMART goals',
        'Mind mapping techniques',
        'Easy ways to boost your productivity',
        'The Ivy Lee Method',
        'Deep work',
        'The two-minute rule',
        'Advanced business productivity strategies',
        'Warren Buffett’s “2 List” strategy',
        'The 80/20 rule (Pareto principle)',
        'Eisenhower Matrix: prioritizing tasks effectively',
        'Kanban method: visualizing workflow',
        'OKR (Objectives and Key Results) framework',
        'Theory of Constraints (TOC)',
        'Getting Things Done (GTD) method',
        'Productivity measurement methods',
        'Quantitative methods',
        'Qualitative methods',
        'Individual productivity measurement',
        'Productivity journaling',
        'Weekly and monthly review sessions',
        'Self-rating scales for productivity',
        'Task completion rates',
        'Measuring output quality',
        'Fostering a productive work environment',
        'Building a culture of productivity',
        'Flexible work arrangements',
        'Employee wellness and its impact on productivity',
        'The role of leadership in enhancing productivity',
        'Leadership styles and their impact on productivity',
        'Case studies: success stories in enhancing productivity',
        'Google: implementing the 80/20 rule to encourage innovation',
        'Toyota: lean manufacturing and continuous improvement',
        'Microsoft Japan: the four-day work week experiment',
        'Slack: utilizing technology for enhanced collaboration',
        'Buffer: embracing remote work and flexibility',
        'Future trends in productivity',
        'Conclusion'
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
      aboutHtml:
        '<p>Elevate your understanding of finance with our comprehensive eBook <strong>Financial Management Explained</strong>. This essential guide equips you with the knowledge and tools needed to navigate the complex world of finance and make informed decisions that drive your organization’s success.</p>' +
        '<p>You will learn about financial statement analysis, a range of financial strategies, financial planning and forecasting, working capital management, and capital budgeting. You’ll also explore the cost of capital, capital structure, dividend policy, risk management, mergers and acquisitions, and international financial management.</p>' +
        '<p>Moreover, you’ll discover the latest trends in sustainable finance, Fintech strategies, and behavioral finance, with practical case studies showing financial management principles in action.</p>',
      toc: [
        'Introduction to financial management',
        'Defining financial management',
        'Objectives of financial management',
        'The role of finance in business',
        'Financial statement analysis',
        'The balance sheet',
        'The income statement',
        'The cash flow statement',
        'Financial ratios and interpretation',
        'Profitability ratios',
        'Liquidity ratios',
        'Efficiency ratios',
        'Leverage ratios',
        'Market value ratios',
        'Financial strategies',
        'Zero-based budgeting (ZBB)',
        'Activity-based costing',
        'Target costing',
        'Value-based management',
        'Financial modelling',
        'Earnings management',
        'Financial restructuring',
        'Leveraged buyouts',
        'Financial synergy',
        'Portfolio management',
        'Behavioral finance',
        'Sustainable finance',
        'Fintech strategies',
        'Financial planning and forecasting',
        'The financial planning process',
        'Budgeting and budgetary control',
        'Financial forecasting techniques',
        'Working capital management',
        'Cash management',
        'Accounts receivable management',
        'Inventory management',
        'Capital budgeting',
        'The capital budgeting process',
        'Time value of money',
        'Capital budgeting techniques',
        'Risk analysis in capital budgeting',
        'Cost of capital',
        'Components of cost of capital',
        'Weighted Average Cost of Capital (WACC)',
        'Factors affecting cost of capital',
        'Capital structure',
        'Concept of capital structure',
        'Optimal capital structure',
        'Theories of capital structure',
        'Financial leverage and leverage ratios',
        'Capital structure decision-making',
        'Dividend policy',
        'Importance of dividend policy',
        'Factors affecting dividend policy',
        'Theories of dividend policy',
        'Dividend policy decision-making',
        'Risk management',
        'Types of financial risks',
        'Risk identification and measurement',
        'Risk management strategies',
        'Role of derivatives in risk management',
        'Mergers and acquisitions',
        'Types of mergers and acquisitions',
        'The M&A process',
        'Valuation in mergers and acquisitions',
        'International financial management',
        'Foreign exchange markets and rates',
        'International financial risks',
        'International financial strategies',
        'Financial management case studies',
        'Conclusion'
      ],
      keywords: ['finance','financial management','trends','ebook']
    },
    'Soft Skills Explained': {
      price: 29, pages: 76,
      desc: 'Build soft skills like active listening and emotional intelligence with practical techniques and methods.',
      features: [
        'Active Listening and Emotional Intelligence',
        'Techniques for Personal and Professional Growth',
        'Pomodoro, ႑Eat the Frog᷿, ႑2-Minute Rule᷿ and more'
      ],
      aboutHtml:
        '<p><strong>Soft Skills Explained</strong> is an easy-to-understand guide to improving your people skills. It shows you the power of soft skills with practical tips to help you talk, listen, solve problems, lead, and adapt.</p>' +
        '<p>You will learn why soft skills matter for both your personal and professional life, how to boost your verbal and non-verbal communication, and how to use positive language and constructive feedback. You will also understand how body language adds meaning to your communication.</p>' +
        '<p>The book dives into active listening, emotional intelligence, and problem-solving skills, and teaches practical techniques like the SOLER listening method, emotional self-management for better relationships, and SWOT-based approaches to tackling challenges.</p>',
      toc: [
        'Why soft skills matter',
        'Definition of soft skills',
        'Soft skills vs hard skills',
        'Verbal communication',
        'Key elements of effective verbal communication',
        'Improving your verbal communication skills',
        'Using positive language and constructive criticism',
        'Non-verbal communication',
        'Role of non-verbal communication',
        'Types of non-verbal communication (body language, eye contact, etc.)',
        'Interpreting non-verbal cues',
        'Practicing control over facial expressions and gestures',
        'Learning to read others’ body language accurately',
        'Active listening',
        'What is active listening?',
        'Importance of active listening in communication',
        'Techniques for active listening',
        'SOLER technique (Sit, Open posture, Lean, Eye contact, Relax)',
        'Reflecting and paraphrasing',
        'Asking open-ended questions',
        'Providing feedback',
        'Overcoming barriers to active listening',
        'Emotional intelligence',
        'Understanding emotional intelligence',
        'Five components of emotional intelligence',
        'Techniques for emotional self-control',
        'Motivation',
        'Empathy',
        'Social skills',
        'Benefits of high emotional intelligence',
        'Developing emotional intelligence',
        'Problem-solving skills',
        'Role of problem-solving in daily life',
        'Problem-solving in the workplace',
        'Understanding the problem-solving process',
        'Types of problem-solving skills (analytical, creative, decision-making, critical, collaborative)',
        'Problem-solving techniques',
        'Brainstorming',
        'SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)',
        'Five Whys technique',
        'Root Cause Analysis (RCA)',
        'Leadership skills',
        'Communication as the foundation of leadership',
        'Emotional intelligence in leadership',
        'Ability to inspire and motivate',
        'Decision-making and problem-solving skills',
        'Delegation and empowerment',
        'Adaptability and innovation',
        'Team building and collaboration',
        'Self-assessment: identifying strengths and weaknesses',
        'Connection between soft skills and leadership',
        'Leadership styles',
        'Autocratic leadership',
        'Democratic leadership',
        'Transformational leadership',
        'Transactional leadership',
        'Servant leadership',
        'Laissez-faire leadership',
        'Delegation',
        'Identifying the right tasks to delegate',
        'Choosing the right person',
        'Providing clear instructions',
        'Delegating responsibility and authority',
        'Setting expectations for reporting',
        'Ensuring availability of resources',
        'Using a delegation tool or matrix (including RACI)',
        'Monitoring progress without micromanaging',
        'Providing feedback and rewards',
        'Adaptability and flexibility',
        'Open-mindedness and willingness to change',
        'Resilience in the face of challenges',
        'Embracing diversity and inclusion',
        'Willingness to learn new skills',
        'Balancing multiple priorities',
        'Time management techniques',
        'Eisenhower Matrix',
        'Pomodoro Technique',
        'Time blocking',
        'Getting Things Done (GTD)',
        '80/20 rule (Pareto principle)',
        'SMART goals',
        'Batching',
        'Two-minute rule',
        'Kanban method',
        'Eat the Frog',
        'Conclusion'
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
      aboutHtml:
        '<p>Learn the fundamental concepts of risk management, including how it differs from crisis management and why it is critical for modern organizations. You will uncover key risk factors such as strategic, compliance, operational, financial, and reputational risks.</p>' +
        '<p>Dive into risk assessment and analysis techniques, from impact vs probability and risk tolerance to qualitative and quantitative methods using tools like SWOT, risk probability–impact matrices, EMV and Monte Carlo simulations.</p>' +
        '<p>You will also explore effective risk mitigation strategies, global frameworks such as ISO 31000 and COSO ERM, industry-specific practices in finance, IT, projects and supply chains, and cutting-edge AI-driven risk management solutions.</p>',
      toc: [
        'Introduction',
        'Risk management vs crisis management',
        'Risk factors and triggers',
        'Strategic risks',
        'Market competition',
        'Changing consumer preferences',
        'Technological innovations',
        'Mergers and acquisitions',
        'Compliance risks',
        'Regulatory changes',
        'Data protection and privacy laws',
        'Environmental regulations',
        'Industry-specific regulations',
        'Operational risks',
        'Supply chain disruptions',
        'Information technology failures',
        'Process failure',
        'Human errors',
        'Financial risks',
        'Market risks: FX, interest rate, commodity price',
        'Credit risks: counterparty default, concentration risk',
        'Liquidity risk',
        'Operational risks in finance: fraud, processing errors',
        'Reputational risks',
        'Social media and online reputation',
        'Media coverage',
        'Stakeholder relationships',
        'Risk assessment',
        'Risk evaluation: impact vs probability',
        'Risk tolerance and appetite',
        'Risk identification techniques: brainstorming, SWOT analysis, scenario analysis',
        'Risk analysis',
        'Qualitative risk analysis',
        'Risk probability–impact matrix',
        'Expert judgment',
        'Risk data quality assessment',
        'Quantitative risk analysis',
        'Sensitivity analysis',
        'Expected Monetary Value (EMV) analysis',
        'Monte Carlo simulation',
        'Discrete-event simulation',
        'Risk mitigation',
        'Risk avoidance',
        'Risk reduction',
        'Risk sharing',
        'Risk acceptance',
        'Risk monitoring and reporting',
        'Risk management frameworks',
        'ISO 31000',
        'COSO ERM framework',
        'Basel Accords',
        'NIST risk management framework',
        'Risk management in different industries',
        'Financial risk management',
        'Hedging',
        'Diversification',
        'Credit risk analysis',
        'Stress testing',
        'IT risk management',
        'IT risk assessment',
        'Implementation of security measures',
        'Regular IT audits',
        'Incident response planning',
        'Project risk management',
        'Project risk assessment',
        'Risk response planning',
        'Contingency planning',
        'Regular project reviews',
        'Supply chain risk management',
        'Supply chain visibility',
        'Supplier risk assessment',
        'Diversification of supply sources',
        'Contingency and business continuity planning',
        'AI-driven risk management solutions',
        'Predictive analytics',
        'NLP for risk analysis',
        'Machine learning for pattern recognition',
        'Automated risk response',
        'Machine learning for optimizing risk mitigation strategies',
        'AI in compliance and regulatory risk management'
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
      aboutHtml:
        '<p>This essential guide equips you with the frameworks, tools, and strategies to navigate and lead change in today’s dynamic business environment.</p>' +
        '<p>From traditional models like Lewin’s Change Management Model to contemporary approaches such as Agile and digital adoption, this eBook serves as a comprehensive manual for leaders, project managers and HR professionals who need to implement effective change management practices.</p>',
      toc: [
        'Introduction',
        'The importance of change management',
        'The evolving business landscape',
        'Understanding change management',
        'Definition and scope',
        'Significance in today’s business',
        'Historical perspective',
        'Change management strategies',
        'Lewin’s Change Management Model',
        'ADKAR Model',
        'Kotter’s 8-step process',
        'McKinsey 7-S Model',
        'Bridges’ Transition Model',
        'Kübler-Ross Change Curve',
        'Burke–Litwin Change Model',
        'Transtheoretical Model',
        'Network of influential relationships',
        'Factors influencing organizational dynamics',
        'Internal factors',
        'External factors',
        'Change management blueprint',
        'Communication strategies',
        'Training and development',
        'Managing resistance to change',
        'Empowering employees',
        'Creating a culture of adaptability',
        'Leveraging technology for change',
        'Change management as a process',
        'Preparation phase',
        'Planning phase',
        'Implementation phase',
        'Consolidation phase',
        'Why change management initiatives fail – what to avoid',
        '7 R’s of change management (Reason, Return, Risks, Resources, Responsible, Relationships, Readiness)',
        'Impact of change management vs business transformation',
        'Key differentiators',
        'Synergies',
        'Change management in different industries',
        'Information Technology (IT)',
        'Healthcare',
        'Finance & Banking',
        'Manufacturing',
        'Retail',
        'Change management case studies',
        'Kodak and the failure to adapt to digital photography',
        'Nokia’s shift from mobile manufacturing to networks',
        'Procter & Gamble’s turnaround under A.G. Lafley',
        'General Motors’ bureaucratic culture',
        'Ford Motor Company’s change under Alan Mulally',
        'Blockbuster’s decline with the rise of Netflix',
        'Change management trends',
        'Rise of digital adoption platforms',
        'Agile vs. Waterfall approaches',
        'The pivotal role of change agents',
        'Humanising the change process',
        'Data-driven change management',
        'Resistance management',
        'Conclusion'
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
      aboutHtml:
        '<p>In this eBook, you’ll gain a comprehensive understanding of the 360-degree performance review process and its significance in employee development and growth.</p>' +
        '<p>You will learn how to design and implement a successful 360-degree review process: setting objectives, selecting raters and stakeholders, defining frequency, developing questions and rating scales, and choosing the right feedback tool or software. The book also covers legal compliance and ethical considerations to ensure a fair and transparent process.</p>' +
        '<p>You will discover how to prepare for a 360 review, maintain confidentiality, support employees and raters with training, and manage timelines. Finally, you will learn how to analyze feedback, give it constructively, implement change, overcome common challenges, and sustain a high‑quality 360 review program over time.</p>',
      toc: [
        'What is a 360-degree performance review?',
        'Benefits of using 360-degree feedback',
        'Differences between traditional performance reviews and 360 reviews',
        'Types of organizations that can benefit from 360 reviews',
        'Designing a 360 review process',
        'Objectives and scope of the review',
        'Selecting raters and stakeholders',
        'Determining the frequency of reviews',
        'Developing review questions and rating scales',
        'Choosing a 360 feedback tool or software',
        'Ensuring legal compliance and ethical considerations',
        'Preparing for a 360 review',
        'Communicating the purpose and expectations of the review',
        'Identifying competencies and skills to be assessed',
        'Ensuring confidentiality and anonymity of feedback',
        'Providing training and support to employees and raters',
        'Developing a timeline and plan for the review process',
        'Conducting a 360 review',
        'Collecting feedback from multiple sources (peers, subordinates, supervisors, self)',
        'Analyzing and interpreting feedback data',
        'Preparing for the feedback session',
        'Ensuring fairness and consistency in the review process',
        'Giving feedback',
        'Communicating feedback effectively and constructively',
        'Addressing discrepancies and conflicts in feedback',
        'Developing a plan for improvement',
        'Providing ongoing support and coaching',
        'Implementing change',
        'Setting goals and action plans based on feedback',
        'Supporting employee development and growth',
        'Monitoring and evaluating progress',
        'Measuring the impact and effectiveness of the review process',
        'Common challenges and solutions',
        'Addressing potential biases and limitations in 360 reviews',
        'Managing resistance and negative reactions to feedback',
        'Ensuring sustainability and effectiveness of the review process',
        'Dealing with sensitive issues such as harassment or discrimination',
        'Addressing cultural and language barriers in multinational organisations',
        'Best practices and case studies',
        'Examples of successful 360 review processes in different industries',
        'Best practices for implementing and sustaining a 360 review process',
        'Key takeaways and next steps for implementing a successful 360 review process',
        'The future of 360-degree performance reviews and their role in the evolving workplace',
        'Conclusion'
      ],
      keywords: ['360 feedback','performance review','hr','implementation','ebook']
    },
    'Employee Engagement Strategies Explained': {
      price: 19, pages: 38,
      desc: 'Strategies to boost engagement, retention, and performance with practical leadership and HR tools.',
      features: [
        'Improve Employee Engagement and Retention',
        'Leadership, Communication, Recognition and Wellness Strategies',
        'Practical KPIs and Real-world Applications'
      ],
      aboutHtml:
        '<p>In <strong>Employee Engagement Strategies Explained</strong>, you will discover why engagement is critical for productivity, performance, retention and customer satisfaction.</p>' +
        '<p>You will learn how to measure engagement using different methods and KPIs, interpret the data, and turn insights into practical improvements. The book explores strategies such as effective leadership and management practices, open communication, recognition and rewards, and building a positive work environment.</p>' +
        '<p>You will also gain insights into employee wellness, involvement and empowerment, as well as fostering diversity, equity and inclusion. Finally, you will learn to avoid common pitfalls and address cultural barriers that can undermine engagement.</p>',
      toc: [
        'Definition of employee engagement',
        'Benefits of employee engagement',
        'Measuring employee engagement',
        'Types of engagement measures',
        'Interpreting and using engagement data',
        'Important KPIs for employee engagement',
        'Impact on productivity and performance',
        'Impact on retention and turnover',
        'Impact on customer satisfaction and loyalty',
        'Strategies for improving employee engagement',
        'Leadership and management practices',
        'Regular check-ins between managers and employees',
        'Communication and feedback',
        'Open-door policy for communication',
        'Regular team meetings to discuss progress and challenges',
        'Recognition and rewards (R&R)',
        'Employee recognition programs',
        'Celebrating employee milestones and achievements',
        'Creating a positive work environment',
        'Providing a comfortable and supportive physical workspace',
        'Encouraging work–life balance',
        'Wellness programs',
        'Promoting physical health (fitness and nutrition programs)',
        'Promoting mental health (stress reduction and counselling)',
        'Employee involvement and empowerment',
        'Encouraging employee feedback and suggestions',
        'Allowing autonomy and decision-making authority',
        'Diversity, equity and inclusion (DEI)',
        'Promoting a diverse and inclusive workplace culture',
        'Addressing bias and discrimination',
        'Pitfalls to avoid in employee engagement',
        'Focusing too much on perks and benefits',
        'Ignoring employee feedback and suggestions',
        'Addressing cultural barriers to engagement',
        'Identifying signs of disengagement',
        'Developing strategies to re-engage employees',
        'Summary of key points',
        'Conclusion'
      ],
      keywords: ['employee engagement','retention','productivity','hr','ebook']
    },
    'Talent Management & Onboarding Explained': {
      price: 19, pages: 38,
      desc: 'Guide to modern talent management, succession planning and onboarding for long-term employee success.',
      features: [
        'Identify Key Roles and Build Succession Plans',
        'Best Practices for Onboarding and Talent Development',
        'DEI-focused Talent Strategies and Practical Tools'
      ],
      aboutHtml:
        '<p>In this eBook, you’ll gain a comprehensive understanding of talent management and onboarding processes, crucial for fostering employee engagement and organizational success.</p>' +
        '<p>You will learn how to identify key roles, develop succession plans, and manage performance through effective feedback and continuous improvement. The book explores talent development strategies, best practices for onboarding, and the latest technology and tools for talent management.</p>' +
        '<p>You will also discover how to embed diversity, equity, and inclusion into talent practices: building inclusive hiring processes, offering equal growth opportunities, and creating a culture of belonging while overcoming real-world talent management challenges.</p>',
      toc: [
        'Identifying key roles and skill sets',
        'Succession planning',
        'Identifying and developing internal candidates for key positions',
        'Creating a succession plan for key roles',
        'Performance management and feedback',
        'Setting performance goals and expectations',
        'Providing feedback and coaching to improve performance',
        'Talent development',
        'Offering opportunities for learning and growth',
        'Providing coaching and mentoring programs',
        'Continuous improvement',
        'Regularly reviewing and updating talent management processes',
        'Measuring success and making adjustments as needed',
        'Best practices in talent management',
        'Overview of the onboarding process',
        'Pre-boarding: before the employee’s first day',
        'Sending welcome emails and materials',
        'Providing access to online resources',
        'Orientation: the employee’s first week',
        'Introducing the company and its culture',
        'Reviewing policies and procedures',
        'Assimilation: the first 90 days',
        'Providing support and guidance',
        'Establishing goals and expectations',
        'Training and development opportunities',
        'Offering on-the-job training and coaching',
        'Providing opportunities for professional development',
        'Best practices in onboarding',
        'Technology and tools for talent management and onboarding',
        'HR Information Systems (HRIS)',
        'Applicant Tracking Systems (ATS)',
        'Learning Management Systems (LMS)',
        'Performance management tools',
        'Best practices for DEI in talent management',
        'Ensuring a diverse and inclusive hiring process',
        'Providing equal opportunities for professional development and growth',
        'Creating a culture of inclusion and belonging',
        'Addressing bias and discrimination in talent management and onboarding',
        'Challenges and solutions in talent management and onboarding',
        'Conclusion'
      ],
      keywords: ['talent management','onboarding','succession planning','deI','hr','ebook']
    },
    'Project Management Explained': {
      price: 29, pages: 68,
      desc: '27 project management methodologies, including Waterfall, Agile, Scrum, PRiSM, PRINCE2, and more.',
      features: [
        '27 Project Management Methodologies',
        'Waterfall, Agile, Scrum, PRiSM, PRINCE2 and more',
        'Real-world Case Studies Included'
      ],
      aboutHtml:
        '<p>With our eBook <strong>Project Management Explained</strong>, you will gain a deep understanding of the key concepts and techniques behind successful project management.</p>' +
        '<p>This book explores 27 different project management methodologies, including Waterfall, Agile, Scrum, PRiSM, PRINCE2, and more. You will also learn about the different project management phases, including planning, analysis, design, development, testing, implementation and maintenance.</p>' +
        '<p>Additionally, the eBook covers topics such as project management roles, tools, and the importance of project timelines and risk management, giving you a complete view of how to manage projects effectively from start to finish.</p>',
      toc: [
        'Introduction',
        'Demystifying project vs. project management',
        'What is a project?',
        'What is project management?',
        'A comprehensive guide to understanding the project lifecycle',
        'Stages of the project life cycle',
        'Types of project life cycle',
        'Significance of the project life cycle',
        'Limitations of the project life cycle',
        'Navigating project management phases for excellence',
        'Planning',
        'Analysis',
        'Design and analysis',
        'Development',
        'Testing',
        'Implementation',
        'Maintenance',
        'Expert tips for choosing the right project management methodology',
        'Importance of project management methodology',
        'Tips on choosing a project management methodology',
        'Common project management approaches',
        'Common project management roles',
        'Choosing the right project management methodology made simple',
        'Waterfall',
        'Agile',
        'PERT',
        'Scrum',
        'Kanban',
        'Extreme Programming (XP) methodology',
        'Adaptive Project Framework (APF) methodology',
        'Lean methodology',
        'Critical Path Method',
        'Critical Chain Project Management',
        'New Product Introduction (NPI)',
        'Package-Enabled Reengineering (PER)',
        'Outcome Mapping',
        'Six Sigma',
        'PMI’s PMBOK',
        'PRINCE2 methodology',
        'Rapid Application Development (RAD) methodology',
        'Event Chain Methodology',
        'Hybrid',
        'Integrated Project Management (IPM)',
        'PRiSM',
        'Crystal',
        'Rational Unified Process (RUP)',
        'Feature-Driven Development (FDD)',
        'Adaptive Software Development (ASD)',
        'Scrumban methodology',
        'Dynamic Systems Development Method (DSDM)',
        'Expert tips for choosing the right project management methodology (advanced view)',
        'Project Integration Management',
        'Project Scope Management',
        'Project Time Management',
        'Project Cost Management',
        'Project Quality Management',
        'Project Resource Management',
        'Project Communications Management',
        'Project Risk Management',
        'Project Procurement Management',
        'Stakeholder Project Management',
        'Implementing the Seven C’s for project excellence',
        'Customers',
        'Capabilities',
        'Capital',
        'Channels',
        'Communication',
        'Coordination',
        'Competitors',
        'Empowering projects with robust management timelines',
        'Significance of project timelines',
        'Project management timeline best practices',
        'A step-by-step guide to crafting an effective risk management plan',
        'Risk identification',
        'Risk assessment',
        'Creating a risk response plan',
        'Assigning risk owners',
        'Understanding your triggers',
        'Making a backup plan',
        'Measuring your risk threshold',
        'The power of value delivery',
        'The foundation of business success',
        'Departments as autonomous entities',
        'Ready-to-use project management templates',
        'NYU Microsoft Word project charter template',
        'ClickUp project charter template',
        'ClickUp product brief template',
        'ClickUp schedule blocking template',
        'Excel four-week timeline template',
        'Discover the top project management tools',
        'Board view',
        'List view',
        'Zoho Projects',
        'Wrike',
        'Monday.com',
        'ProofHub',
        'Clarizen',
        'Conclusion'
      ],
      keywords: ['project management','methodologies','scrum','waterfall','tools','ebook']
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

    // Apply per-product theme class on body (e.g. theme-o1, theme-m1)
    try {
      var body = document.body;
      if (body) {
        Array.from(body.classList || []).forEach(function(cls){
          if (/^theme-/.test(cls)) body.classList.remove(cls);
        });
        if (code) body.classList.add('theme-' + String(code));
      }
    } catch(_) {}

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
        tocEl.innerHTML = tocSource.map(function(item){
          var isPart = /^<strong>Part\s+\d+/i.test(item || '');
          var cls = isPart ? ' class="toc-part-item"' : '';
          return '<li'+cls+'>'+item+'</li>';
        }).join('');
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
