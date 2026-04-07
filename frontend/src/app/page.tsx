'use client';

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatResponse = {
  respuesta: string;
  provider: string;
  tokens_usados?: number;
};

const providers = [
  { id: 'gemini', name: 'Google Gemini', icon: '✨' },
  { id: 'openai', name: 'OpenAI GPT-4', icon: '🤖' },
  { id: 'claude', name: 'Anthropic Claude', icon: '🎭' },
  { id: 'deepseek', name: 'DeepSeek IA', icon: '🧠' },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pregunta: input,
          provider: provider,
          historial: messages,
        }),
      });

      if (!response.ok) throw new Error('Error al conectar con el asistente');

      const data: ChatResponse = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.respuesta }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, hubo un error técnico. ¿Podrías intentar de nuevo?' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="chat-container">
      <Head>
        <title>Tierra de Agricultores AI</title>
      </Head>

      {/* Sidebar / Sidebar Mobile Navigation */}
      <div className="sidebar glass-morphism">
        <div className="brand-section">
          <h1 className="brand-name">Tierra de<span>Agricultores</span></h1>
          <p className="brand-tagline">Impulsando el campo con IA</p>
        </div>

        <div className="provider-selector">
          <h3>Selecciona el cerebro</h3>
          <div className="selector-grid">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`provider-btn ${provider === p.id ? 'active' : ''}`}
              >
                <span className="icon">{p.icon}</span>
                <span className="name">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-area">
        <header className="chat-header glass-morphism">
          <div className="status-badge">
            <span className="pulse"></span>
            Asistente en línea
          </div>
        </header>

        <div className="messages-viewport">
          {messages.length === 0 ? (
            <div className="welcome-screen animate-fade-in">
              <div className="welcome-icon">🌱</div>
              <h2>¡Hola! Soy tu asistente de Tierra de Agricultores</h2>
              <p>¿En qué puedo ayudarte hoy sobre productos, agricultores o precios?</p>
              <div className="suggestion-chips">
                <button onClick={() => setInput('¿Qué frutas tienen disponibles?')}>🍉 Frutas disponibles</button>
                <button onClick={() => setInput('¿Y cuánto cuesta el ñame?')}>🥔 Precio del ñame</button>
                <button onClick={() => setInput('Háblame de los agricultores asociados')}>👨‍🌾 Asociados</button>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role} animate-fade-in`}>
                <div className="message-bubble">
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message-wrapper assistant animate-fade-in">
              <div className="message-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="chat-input-area">
          <form onSubmit={handleSubmit} className="input-form glass-morphism">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              disabled={loading}
              autoFocus
            />
            <button type="submit" disabled={loading} className="send-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </footer>
      </div>

      <style jsx>{`
        .chat-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          height: 100vh;
          max-height: 100vh;
          background: var(--background);
        }

        .sidebar {
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          border-right: 1px solid var(--border);
          z-index: 10;
        }

        .brand-name {
          font-size: 1.5rem;
          color: var(--primary);
          line-height: 1.1;
        }

        .brand-name span {
          display: block;
          color: var(--secondary);
          font-size: 1.2rem;
        }

        .brand-tagline {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .provider-selector h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .selector-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .provider-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background: transparent;
          text-align: left;
          color: var(--text);
          border: 1px solid transparent;
        }

        .provider-btn:hover {
          background: rgba(0,0,0,0.03);
        }

        .provider-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(45, 90, 39, 0.3);
        }

        .chat-area {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .chat-header {
          padding: 1rem 2rem;
          display: flex;
          justify-content: flex-end;
          border-bottom: 1px solid var(--border);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4caf50;
          box-shadow: 0 0 0 rgba(76, 175, 80, 0.4);
          animation: status-pulse 2s infinite;
        }

        @keyframes status-pulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }

        .messages-viewport {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .welcome-screen {
          margin: auto;
          text-align: center;
          max-width: 500px;
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .welcome-screen h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .welcome-screen p {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }

        .suggestion-chips button {
          padding: 0.6rem 1rem;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          font-size: 0.9rem;
        }

        .suggestion-chips button:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--background);
        }

        .message-wrapper {
          display: flex;
          width: 100%;
        }

        .message-wrapper.user {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 70%;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }

        .user .message-bubble {
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .assistant .message-bubble {
          background: white;
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }

        .typing span {
          height: 8px;
          width: 8px;
          background: var(--text-muted);
          display: inline-block;
          border-radius: 50%;
          margin: 0 2px;
          opacity: 0.4;
          animation: typing-bounce 1s infinite;
        }

        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .chat-input-area {
          padding: 1.5rem 2rem 2.5rem;
        }

        .input-form {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0.5rem 0.5rem 1.5rem;
          border-radius: var(--radius-lg);
          max-width: 800px;
          margin: 0 auto;
          box-shadow: var(--shadow);
        }

        .input-form input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 1rem;
          outline: none;
          color: var(--text);
          padding: 0.75rem 0;
        }

        .send-btn {
          background: var(--primary);
          color: white;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .send-btn:hover {
          transform: scale(1.05);
          background: var(--primary-light);
        }

        .send-btn svg {
          width: 20px;
          height: 20px;
        }

        @media (max-width: 768px) {
          .chat-container {
            grid-template-columns: 1fr;
          }
          .sidebar {
            display: none; /* In a real app we'd add a hamburger menu */
          }
          .message-bubble {
            max-width: 85%;
          }
        }
      `}</style>
    </main>
  );
}
