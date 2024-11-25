import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { Toaster } from 'sonner';

function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <Toaster />
      {}
    </QueryClientProvider>
  );
}

export default App;
 