import { useState } from 'react';
import axios from 'axios';
import initialLayout from '../data/initialLayout.json';

export function useLayoutAgent() {
  const [layout, setLayout] = useState(initialLayout);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your Layout Agent. I can help you modify this design. Try asking me:\n• "Convert to 9:16"\n• "Move the headline to the top"\n• "Make the discount badge bigger"\n• "Change headline color to red"'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (text) => {
    const newUserMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/chat', {
        message: text,
        layout,
        history: messages.slice(-6)
      });

      if (data.updatedLayout) {
        setLayout(data.updatedLayout);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.explanation || 'Done! Layout updated.' }
      ]);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Something went wrong. Please try again.';
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ ${errMsg}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetLayout = () => {
    setLayout(initialLayout);
    setMessages([
      {
        role: 'assistant',
        content: '🔄 Layout has been reset to the original design!'
      }
    ]);
    setError(null);
  };

  return { layout, messages, loading, error, sendMessage, resetLayout };
}
