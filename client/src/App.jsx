import { useState } from 'react';
import axios from 'axios';
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
      const response = await axios.post('/api/summarize', { text });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Backend unreachable (404?): Start server with `cd server && npm run dev`');
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
