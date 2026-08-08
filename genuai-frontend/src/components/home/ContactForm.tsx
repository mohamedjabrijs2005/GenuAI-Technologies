import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Mail, User, Building, Sparkles } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Candidate');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 lg:py-32 bg-surface-bright/50 border-t border-b border-surface-container/50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-brand/20">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4 leading-tight">
            Have a Question About GenuAI?
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Whether you are a candidate, hiring manager, university partner, or investor, reach out directly to the GenuAI team. No login required.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="glass rounded-3xl p-8 sm:p-12 border border-surface-container shadow-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-[fadeIn_0.3s_ease]">
              <div className="w-16 h-16 rounded-full bg-success/15 text-success mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-on-surface">Message Received!</h3>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                "Thank you. Your message has been received by the GenuAI team. We will review your inquiry and get back to you shortly."
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-surface border border-surface-container text-xs font-bold text-on-surface hover:bg-surface-bright transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-indigo-brand focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-indigo-brand focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                  I am a:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {['Candidate', 'Company', 'Institution', 'Investor', 'Mentor', 'Other'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        role === r
                          ? 'bg-indigo-brand text-white border-indigo-brand shadow-sm'
                          : 'bg-surface border-surface-container text-on-surface-variant hover:border-surface-container-high'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question about our assessment ecosystem, university pilot, or corporate partnership..."
                  className="w-full p-4 rounded-xl bg-surface border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-indigo-brand focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-brand to-indigo-brand-dark hover:shadow-xl hover:shadow-indigo-brand/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
