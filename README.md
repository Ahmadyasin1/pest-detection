# AgroPest AI - Advanced Agriculture Pest Detection

A professional AI-powered pest detection system for modern agriculture. Upload images and get instant, accurate pest identification using advanced deep learning models.

## Features

- Real-time pest detection using AI
- Detailed model analysis and metrics
- Interactive data visualization
- Responsive design for all devices
- Advanced error handling and loading states

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Radix UI

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agriculture-pest-detection
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_API_BASE_URL=https://cropbugdetection.pythonanywhere.com
VITE_APP_NAME=AgroPest AI
VITE_APP_DESCRIPTION=Advanced Agriculture Pest Detection System
VITE_APP_VERSION=1.0.0
```

4. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure environment variables in the Vercel dashboard
5. Deploy

### Environment Variables

Make sure to set these environment variables in your deployment platform:

- `VITE_API_BASE_URL`: Your API base URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_DESCRIPTION`: Application description
- `VITE_APP_VERSION`: Application version

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Error Handling

The application includes:
- Error boundaries for graceful error handling
- Loading states for better UX
- Proper TypeScript types for type safety
- Comprehensive error logging

## Performance Optimization

- Code splitting with React.lazy
- Optimized asset loading
- Efficient bundle splitting
- Proper caching strategies

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details 