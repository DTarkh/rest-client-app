export type Feature = {
  icon: string;
  title: string;
  description: string;
};

export const FEATURES: Feature[] = [
  {
    icon: '⚡',
    title: 'Fast Request Testing',
    description:
      'Send HTTP requests with all methods, custom headers, and bodies. Get instant responses with status details.',
  },
  {
    icon: '💻',
    title: 'Code Generation',
    description:
      'Generate snippets in cURL, JavaScript, Python, Java, C#, and Go for easy integration.',
  },
  {
    icon: '🕒',
    title: 'Request History',
    description: 'Track all requests with response times, status codes, and payload sizes.',
  },
  {
    icon: '🌐',
    title: 'Variables System',
    description: 'Use dynamic variables in URLs, headers, and bodies with {{variableName}} syntax.',
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    description: 'Share requests and collections. Collaborate with shared workspaces.',
  },
  {
    icon: '🛡️',
    title: 'Secure Authentication',
    description: 'Protected routes and user management for enterprise-grade security.',
  },
];

export function Features() {
  return (
    <section id='features' className='py-20 px-4 '>
      <div className='container mx-auto max-w-6xl'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Everything You Need for API Testing
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Professional-grade features designed to make API testing efficient and collaborative
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {FEATURES.map(f => (
            <article
              key={f.title}
              className='border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white'
            >
              <div className='flex items-center space-x-2 mb-4'>
                <div className='p-2 bg-purple-50 rounded-lg'>
                  <span className='text-purple-600 text-xl'>{f.icon}</span>
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>{f.title}</h3>
              </div>
              <p className='text-gray-600'>{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
