const SENTIMENT_COLORS = {
  positive: '#4ade80',
  neutral: '#facc15',
  negative: '#f87171'
};

function ResultDisplay({ result }) {
  return (
    <div className="result">
      <h2>Summary</h2>
      <p className="summary">{result.summary}</p>
      
      <h3>Key Points</h3>
      <ul className="keypoints">
        {result.keyPoints.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
      
      <div className="sentiment">
        <strong>Sentiment: </strong>
        <span 
          className="sentiment-label" 
          style={{ backgroundColor: SENTIMENT_COLORS[result.sentiment], color: 'white' }}
        >
          {result.sentiment.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default ResultDisplay;
