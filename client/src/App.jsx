import { useState } from 'react';
import TextInput from './components/TextInput';
import ResultDisplay from './components/ResultDisplay';
import './components/TextInput.css';
import './components/ResultDisplay.css';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (text) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(data.error || 'API error');
        } else {
          throw new Error(`API error (${response.status}): Backend server might be unreachable.`);
        }
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server. Check if the backend is running.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>AI Text Summarizer</h1>
      <TextInput onSubmit={handleSubmit} loading={loading} />
      {error && <div className="error">{error}</div>}
      {result && <ResultDisplay result={result} />}
    </div>
  );
}

export default App;
