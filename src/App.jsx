import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, DollarSign, Users, CheckCircle2, 
  MessageSquare, Compass, Sliders, Plus, Trash2, ArrowUpRight, 
  Layers, ChevronRight, Award, ShieldAlert, Heart, Wine, PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EVENT_ARCHETYPES, generateAIEventConcept, generateGenAIResponse } from './data/eventArchetypes';

export default function App() {
  const [selectedType, setSelectedType] = useState('wedding');
  const [guestCount, setGuestCount] = useState(140);
  const [budget, setBudget] = useState(35000);
  const [theme, setTheme] = useState('Modern Botanical Glasshouse');
  
  // Tabs: 'overview', 'budget', 'timeline', 'vendors', 'assistant'
  const [activeTab, setActiveTab] = useState('overview');

  // Archetype state trackers
  const activeArchetype = EVENT_ARCHETYPES[selectedType];
  const [timelineItems, setTimelineItems] = useState(activeArchetype.sampleTimelines);
  const [budgetItems, setBudgetItems] = useState(activeArchetype.sampleBudgets);
  const [vendorList, setVendorList] = useState(activeArchetype.sampleVendors);
  
  // AI Concept Memo
  const [aiConcept, setAiConcept] = useState(() => 
    generateAIEventConcept(selectedType, theme, budget, guestCount)
  );

  // Chatbot State
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your **GenAI Event Architect**. I've synthesized an optimal framework for your **${activeArchetype.label}** across guest dynamics, milestone timelines, financial allocation, and vendor SLAs. How can I assist your planning today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // When Archetype changes, re-hydrate defaults
  const handleArchetypeSwitch = (typeKey) => {
    setSelectedType(typeKey);
    const arch = EVENT_ARCHETYPES[typeKey];
    setGuestCount(arch.defaultGuests);
    setBudget(arch.defaultBudget);
    setTheme(arch.themes[0]);
    setTimelineItems(arch.sampleTimelines);
    setBudgetItems(arch.sampleBudgets);
    setVendorList(arch.sampleVendors);
    
    setAiConcept(generateAIEventConcept(typeKey, arch.themes[0], arch.defaultBudget, arch.defaultGuests));

    setMessages([
      {
        sender: 'ai',
        text: `Switched mode to **${arch.label}**. Your baseline budget is configured to **$${arch.defaultBudget.toLocaleString()}** for **${arch.defaultGuests} attendees**. What facet should we tailor first?`
      }
    ]);
  };

  // Re-run AI concept synthesis on core parameters
  const reSynthesizeConcept = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#8b5cf6', '#10b981']
    });
    setAiConcept(generateAIEventConcept(selectedType, theme, budget, guestCount));
  };

  // Timeline toggle
  const toggleTimelineStatus = (id) => {
    setTimelineItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'completed' ? 'pending' : 'completed'
        };
      }
      return item;
    }));
  };

  // Budget calculations
  const totalPlanned = budgetItems.reduce((acc, curr) => acc + curr.planned, 0);
  const totalActual = budgetItems.reduce((acc, curr) => acc + curr.actual, 0);
  const budgetVariance = budget - totalActual;

  // New budget item helper
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(activeArchetype.categories[0]);

  const handleAddBudgetItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemCost) return;
    const val = Number(newItemCost);
    const newItem = {
      id: 'custom-' + Date.now(),
      category: newItemCategory,
      item: newItemName,
      planned: val,
      actual: val,
      paid: false
    };
    setBudgetItems([...budgetItems, newItem]);
    setNewItemName('');
    setNewItemCost('');
  };

  // AI Chat Submit
  const handleSendMessage = (e, customPrompt) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim()) return;

    const userMsg = { sender: 'user', text: promptToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReplyText = generateGenAIResponse(promptToSend, activeArchetype, {
        totalBudget: budget,
        guestCount: guestCount,
        theme: theme
      });
      setMessages(prev => [...prev, { sender: 'ai', text: aiReplyText }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation Bar */}
      <header style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
          }}>
            <Sparkles size={22} color="#000" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Utsavavaibhavam-AI</h1>
              <span className="badge badge-gold">उत्सव वैभवम् • v2.4</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Adaptive Event Intelligence & Multi-Stage Orchestration</p>
          </div>
        </div>

        {/* Event Archetype Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          gap: 4
        }}>
          {[
            { id: 'wedding', label: 'Wedding Gala', icon: Heart },
            { id: 'birthday', label: 'Milestone / Birthday', icon: PartyPopper },
            { id: 'community', label: 'Community Festival', icon: Users }
          ].map(type => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => handleArchetypeSwitch(type.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isSelected ? 'var(--accent-gold)' : 'transparent',
                  color: isSelected ? '#000' : 'var(--text-muted)',
                  boxShadow: isSelected ? '0 2px 10px rgba(245, 158, 11, 0.3)' : 'none'
                }}
              >
                <Icon size={16} />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Global Action */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn btn-ai"
            onClick={reSynthesizeConcept}
          >
            <Sparkles size={16} />
            Auto-Synthesize Blueprint
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '28px', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Hero Parameter Config Panel */}
        <section className="glass-panel" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, alignItems: 'center' }}>
            
            <div>
              <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: 8 }}>
                Current Archetype
              </label>
              <h2 className="font-serif" style={{ fontSize: '1.45rem', color: '#fff', fontWeight: 700 }}>
                {activeArchetype.label}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {activeArchetype.tagline}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Target Budget</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  ${budget.toLocaleString()}
                </span>
              </div>
              <input 
                type="range" 
                min={2000} 
                max={100000} 
                step={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4 }}>
                <span>$2,000</span>
                <span>Per Guest: ~${Math.round(budget / (guestCount || 1))}</span>
                <span>$100,000+</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Expected Guest Count</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                  {guestCount} Attendees
                </span>
              </div>
              <input 
                type="range" 
                min={10} 
                max={1000} 
                step={10}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4 }}>
                <span>10 Intimate</span>
                <span>Capacity Index: {guestCount > 300 ? 'High' : guestCount > 100 ? 'Medium' : 'Boutique'}</span>
                <span>1000 Mega</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: 8 }}>
                Aesthetic & Theme Narrative
              </label>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {activeArchetype.themes.map(t => (
                  <option key={t} value={t} style={{ background: '#1e293b', color: '#fff' }}>{t}</option>
                ))}
              </select>
            </div>

          </div>
        </section>

        {/* GenAI Conceptual Blueprint Banner */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px 28px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(30px)'
          }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="badge badge-purple">
                  <Sparkles size={12} /> GenAI Synthesized Signature
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Architect Viability Rating: <strong style={{ color: '#34d399' }}>{aiConcept.aiScore}%</strong>
                </span>
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
                "{aiConcept.conceptName}"
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 4, maxWidth: 800 }}>
                <strong>Highlight:</strong> {aiConcept.signatureMoment}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Color Palette</span>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  {aiConcept.colorPalette.map(c => (
                    <div 
                      key={c.name}
                      title={c.name}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: c.hex,
                        border: '2px solid rgba(255,255,255,0.2)',
                        cursor: 'help'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ height: 36, width: 1, background: 'var(--border-subtle)' }} />

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Sensory & Vibe Tags</span>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  {aiConcept.vibeKeywords.map(v => (
                    <span key={v} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '6px', color: '#cbd5e1' }}>
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: 8 }}>
          {[
            { id: 'overview', label: 'Executive Overview', icon: Layers },
            { id: 'budget', label: `Budget Ledger ($${totalActual.toLocaleString()})`, icon: DollarSign },
            { id: 'timeline', label: `Run of Show & Checklist (${timelineItems.filter(t => t.status === 'completed').length}/${timelineItems.length})`, icon: Calendar },
            { id: 'vendors', label: `Vendor Ecosystem (${vendorList.length})`, icon: Award },
            { id: 'assistant', label: 'GenAI Planning Copilot', icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent-gold)' : 'var(--text-dim)'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Executive Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            
            {/* Stat Card 1 */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Financial Allocation</span>
                <span className={`badge ${budgetVariance >= 0 ? 'badge-emerald' : 'badge-gold'}`}>
                  {budgetVariance >= 0 ? 'Within Budget' : 'Deficit Alert'}
                </span>
              </div>
              <h4 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 12 }}>
                ${totalActual.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 400 }}>/ ${budget.toLocaleString()}</span>
              </h4>
              <div style={{ marginTop: 14, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${Math.min(100, (totalActual / (budget || 1)) * 100)}%`, 
                    background: totalActual > budget ? '#ef4444' : 'linear-gradient(90deg, #10b981, #f59e0b)' 
                  }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                <span>Spent: {Math.round((totalActual / (budget || 1)) * 100)}%</span>
                <span>Buffer: ${budgetVariance.toLocaleString()}</span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Milestone Execution</span>
                <span className="badge badge-purple">Run-of-Show Lock</span>
              </div>
              <h4 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 12 }}>
                {Math.round((timelineItems.filter(t => t.status === 'completed').length / timelineItems.length) * 100)}%
                <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 400 }}> readiness</span>
              </h4>
              <div style={{ marginTop: 14, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${(timelineItems.filter(t => t.status === 'completed').length / timelineItems.length) * 100}%`, 
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' 
                  }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                <span>{timelineItems.filter(t => t.status === 'completed').length} completed</span>
                <span>{timelineItems.filter(t => t.status !== 'completed').length} pending actions</span>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vendor Network</span>
                <span className="badge badge-gold">Active Contracts</span>
              </div>
              <h4 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 12 }}>
                {vendorList.length} <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 400 }}>Suppliers</span>
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 10 }}>
                Lead Partner: <strong style={{ color: '#fff' }}>{vendorList[0]?.name || 'N/A'}</strong>
              </p>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: 4 }}>
                  {vendorList.filter(v => v.status === 'Confirmed').length} Confirmed
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 8px', borderRadius: 4 }}>
                  {vendorList.filter(v => v.status !== 'Confirmed').length} In Review
                </span>
              </div>
            </div>

            {/* AI Risk & Advisory Deep-dive */}
            <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <ShieldAlert size={20} color="#f59e0b" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>GenAI Strategic Risk & Contingency Advisory</h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {aiConcept.genaiRiskAdvisory}
              </p>
              <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 10, flex: 1, minWidth: 260 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>Catering Formulation</span>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: 4 }}>{aiConcept.recommendedCatering}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 10, flex: 1, minWidth: 260 }}>
                  <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Operational Rhythm</span>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: 4 }}>Dynamic load-in windows planned across {guestCount} expected guests.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Budget Ledger */}
        {activeTab === 'budget' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Quick Add Form */}
            <form onSubmit={handleAddBudgetItem} className="glass-panel" style={{ padding: '20px 24px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 2, minWidth: 200 }}>
                <input 
                  type="text" 
                  placeholder="Line item description (e.g., Cold Sparks Machine)" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 14px',
                    borderRadius: 8,
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 140 }}>
                <select 
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 14px',
                    borderRadius: 8,
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  {activeArchetype.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ width: 140 }}>
                <input 
                  type="number" 
                  placeholder="Cost ($)" 
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 14px',
                    borderRadius: 8,
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Add Budget Item
              </button>
            </form>

            {/* Budget Table */}
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>Category</th>
                    <th style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>Deliverable Item</th>
                    <th style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>Allocated</th>
                    <th style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>Actual / Quoted</th>
                    <th style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right', color: 'var(--text-muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetItems.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--accent-gold)' }}>
                        {item.category}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#fff' }}>
                        {item.item}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                        ${item.planned.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: item.actual > item.planned ? '#f87171' : '#fff' }}>
                        ${item.actual.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <button
                          onClick={() => {
                            setBudgetItems(prev => prev.map(b => b.id === item.id ? { ...b, paid: !b.paid } : b));
                          }}
                          style={{
                            background: item.paid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.06)',
                            color: item.paid ? '#34d399' : 'var(--text-dim)',
                            border: '1px solid ' + (item.paid ? 'rgba(16, 185, 129, 0.3)' : 'transparent'),
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                        >
                          {item.paid ? 'Paid' : 'Unpaid'}
                        </button>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button 
                          onClick={() => setBudgetItems(prev => prev.filter(b => b.id !== item.id))}
                          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 3: Timeline & Checklist */}
        {activeTab === 'timeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Chrono-Milestones & Run of Show</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Click milestone to toggle status or trigger automated countdown tracking.</p>
              </div>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  const newMilestone = {
                    id: 'custom-t-' + Date.now(),
                    phase: 'Day-Of Highlight',
                    title: 'Interactive Photo Moment & Champagne Toast',
                    status: 'pending',
                    owner: 'MC & Coordinator',
                    tag: 'Custom',
                    date: '08:30 PM'
                  };
                  setTimelineItems([...timelineItems, newMilestone]);
                }}
              >
                <Plus size={16} /> Add Milestone
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {timelineItems.map((item, index) => {
                const isDone = item.status === 'completed';
                return (
                  <div 
                    key={item.id} 
                    className="glass-panel"
                    onClick={() => toggleTimelineStatus(item.id)}
                    style={{
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      cursor: 'pointer',
                      borderLeft: isDone ? '4px solid #10b981' : '4px solid var(--accent-gold)',
                      opacity: isDone ? 0.75 : 1
                    }}
                  >
                    <div style={{ color: isDone ? '#10b981' : 'var(--text-dim)' }}>
                      <CheckCircle2 size={24} />
                    </div>

                    <div style={{ width: 110 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        {item.phase}
                      </span>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{item.date}</div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        fontSize: '0.98rem', 
                        fontWeight: 600, 
                        color: isDone ? 'var(--text-muted)' : '#fff',
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}>
                        {item.title}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        Assigned: <strong>{item.owner}</strong>
                      </span>
                    </div>

                    <div>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: 'rgba(255,255,255,0.06)',
                        color: '#cbd5e1'
                      }}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Vendor Ecosystem */}
        {activeTab === 'vendors' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {vendorList.map(vendor => (
              <div key={vendor.id} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-gold">{vendor.role}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: vendor.status === 'Confirmed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: vendor.status === 'Confirmed' ? '#34d399' : '#fbbf24'
                    }}>
                      {vendor.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: 12, color: '#fff' }}>
                    {vendor.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    {vendor.notes}
                  </p>
                </div>

                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Contract Value</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{vendor.quote}</span>
                  </div>

                  <button 
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => {
                      setActiveTab('assistant');
                      handleSendMessage(null, `Help me review the contract and negotiate SLA deliverables with ${vendor.name} (${vendor.role}).`);
                    }}
                  >
                    Draft RFP / Chat <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: GenAI Assistant */}
        {activeTab === 'assistant' && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: 600, overflow: 'hidden' }}>
            
            {/* Chat Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Utsavavaibhavam-AI Real-Time Reasoning Engine</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Context: {activeArchetype.label} • ${budget.toLocaleString()} • {guestCount} Guests</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {activeArchetype.promptSuggestions.slice(0, 2).map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(null, sug)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 14,
                      padding: '4px 12px',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    "{sug.slice(0, 32)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((m, idx) => (
                <div 
                  key={idx}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: m.sender === 'user' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    borderRadius: 14,
                    padding: '14px 18px',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    border: m.sender === 'ai' ? '1px solid var(--border-subtle)' : 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '12px 18px', borderRadius: 14, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  GenAI Architect synthesizing recommendations...
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
              <input 
                type="text" 
                placeholder="Ask about budget allocations, vendor contracts, run-of-show timing, or personalized ideas..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button type="submit" className="btn btn-ai">
                Ask GenAI
              </button>
            </form>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '18px 28px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        background: 'rgba(11, 15, 25, 0.9)'
      }}>
        Utsavavaibhavam-AI (उत्सववैभवम् AI) • Grand Indian & Global Event Intelligence by 31-yr GenAI Data Scientist • Weddings, Milestones & Community Galas
      </footer>

    </div>
  );
}
