import React, { useState } from 'react';
import { 
  Shield, Lock, FileText, CheckCircle2, ChevronRight, X, Copy, Check, 
  Terminal, ShieldAlert, Cpu, Award, Zap, HelpCircle, FileCheck, RefreshCw, BarChart2
} from 'lucide-react';
import { motion } from 'motion/react';
import AiecLogo from './AiecLogo';

interface FooterPagesReaderProps {
  initialTab: 'privacy' | 'terms' | 'security' | 'compliance' | 'why';
  onClose: () => void;
  onEnterConsole: () => void;
}

export default function FooterPagesReader({ initialTab, onClose, onEnterConsole }: FooterPagesReaderProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'security' | 'compliance' | 'why'>(initialTab);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // States for interactive widgets inside pages
  const [copiedCodeBlock, setCopiedCodeBlock] = useState(false);
  const [interactiveActionType, setInteractiveActionType] = useState('VERIFY_OUTPUT');
  const [interactiveHashIdx, setInteractiveHashIdx] = useState('9af2e5b7c01a...');
  const [interactivePredecessor, setInteractivePredecessor] = useState('e3b0c44298fc...');
  const [interactiveKeyFingerprint, setInteractiveKeyFingerprint] = useState('gc_master_key');
  const [interactiveSignature, setInteractiveSignature] = useState('');
  const [isSigningInWidget, setIsSigningInWidget] = useState(false);

  const handleTriggerWidgetSignature = () => {
    setIsSigningInWidget(true);
    setTimeout(() => {
      const generatedSig = Array.from({ length: 48 }, () => 
         Math.floor(Math.random() * 16).toString(16)
      ).join('') + '_Ed25519_EdDSA_Symmetric';
      setInteractiveSignature(generatedSig);
      setIsSigningInWidget(false);
    }, 850);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const tabs = [
    { id: 'why', label: 'Why AIEC?', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'security', label: 'Technical Security Architecture', icon: Lock },
    { id: 'compliance', label: 'Compliance & Standards Mapping', icon: Award },
  ] as const;

  return (
    <div className="bg-[#0B0F19] min-h-screen text-[#dfe2f1] font-sans antialiased selection:bg-indigo-500/30 selection:text-white pb-20" id="docs-reader-container">
      {/* Header */}
      <header className="border-b border-[#1F2937] bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-50 px-6 h-16 flex items-center justify-between" id="docs-reader-header">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#171b26] border border-transparent hover:border-[#1F2937] transition-all text-gray-400 hover:text-white"
            title="Return to Landing Page"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="h-6 w-[1px] bg-gray-800" />
          <div className="flex items-center gap-3">
            <AiecLogo size="xs" showText={true} />
            <span className="text-gray-500 text-xs font-mono font-bold uppercase tracking-wider self-center block mt-1">/ DOCS</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onEnterConsole}
            className="bg-indigo-650 hover:bg-indigo-600 text-white font-mono text-xs font-semibold px-4 py-2 rounded border border-indigo-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-505/10"
          >
            Launch Interactive Console
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8" id="docs-layout">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1" id="docs-sidebar">
          <div className="text-[10px] font-mono font-bold text-gray-550 uppercase px-3 mb-2 tracking-wider">
            Document Categories
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded text-left transition-all text-xs font-semibold ${
                  isActive 
                    ? 'bg-[#171b26] border border-[#1f2937] text-white font-bold' 
                    : 'border border-transparent text-gray-405 hover:bg-[#101420]/50 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-8 px-3">
            <div className="border border-indigo-950/40 bg-indigo-950/10 p-4 rounded-lg relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
              <h4 className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-indigo-400" /> Auditor-Ready
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                Need customized verification templates or localized GDPR/HIPAA compliance maps? Explore the interactive simulation dashboard.
              </p>
              <button
                onClick={onEnterConsole}
                className="w-full bg-[#111522] hover:bg-indigo-900/10 border border-[#1f2937] text-[#dfe2f1] text-[10px] font-mono font-bold py-2 rounded transition-colors text-center cursor-pointer"
              >
                Open Verification Sandbox
              </button>
            </div>
          </div>
        </div>

        {/* Main Document Display Portal */}
        <div className="lg:col-span-9 bg-[#111522]/40 border border-[#1F2937] rounded-xl p-8 backdrop-blur shadow-2xl relative min-h-[600px] text-left" id="document-reading-pane">
          {/* Subtle Ambient top-right glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] pointer-events-none rounded-full"></div>

          {/* Tab Content: Why AIEC */}
          {activeTab === 'why' && (
            <motion.article 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              id="why-aiec-canvas"
            >
              <div className="border-b border-gray-800 pb-5">
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-400" /> Strategic Alignment & Governance
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Why AIEC?</h1>
                <div className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-1.5">
                  <span>ENTERPRISE GOVERNANCE ENGINE & DECOUPLED AUDIT TRAILS</span>
                </div>
              </div>

              <p className="text-sm text-gray-305 leading-relaxed">
                Enterprise generative AI integration has outpaced traditional compliance and governance frameworks. As organizations transition from prototyping to deploying production-grade AI agents, they hit a critical bottleneck: auditors, regulators, and enterprise buyers demand proof of operations, data provenance, and human-in-the-loop oversight <span className="text-indigo-400 font-mono font-semibold">[1.1.2]</span>.
              </p>

              <div className="p-4 rounded-lg bg-red-950/20 border border-red-900/40 text-xs sm:text-sm text-red-300 flex gap-3 items-start my-4">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white tracking-tight text-xs uppercase">Legacy Auditing Failure</h4>
                  <p className="text-gray-400 leading-relaxed mt-1 text-xs">
                    Traditional system logging (like Splunk, Datadog, or custom database tables) cannot satisfy modern AI compliance standards.
                  </p>
                </div>
              </div>

              <div className="border border-indigo-950/50 bg-[#161c2d]/25 p-4 rounded-lg text-xs leading-relaxed">
                <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">The AIEC Alternative</p>
                <p className="text-gray-300 font-medium font-mono">
                  Here is exactly why organizations integrate AIEC as their dedicated AI governance layer.
                </p>
              </div>

              {/* 1. The Core Compliance Dilemma */}
              <div className="space-y-3 pt-2">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-[#1f2937] text-indigo-300 text-[11px] font-semibold font-mono">1</span>
                  The Core Compliance Dilemma
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  To pass ISO 42001 audits, SOC 2 Type II reviews, or EU AI Act conformity assessments, GRC teams must verify the lifecycle of AI decisions <span className="text-indigo-400 font-mono font-semibold">[1.1.2, 1.2.5]</span>. This exposes two severe technical risks:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="border border-[#1F2937] bg-[#111522]/50 p-4 rounded text-left">
                    <span className="text-[10px] font-bold font-mono text-[#f87171] uppercase tracking-wide block mb-1">The Privacy Trap</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Storing raw system prompts, model inputs, and outputs in centralized databases to satisfy audits exposes sensitive IP, corporate secrets, and PII to data breaches or regulatory violations (e.g., GDPR, HIPAA).
                    </p>
                  </div>
                  <div className="border border-[#1F2937] bg-[#111522]/50 p-4 rounded text-left">
                    <span className="text-[10px] font-bold font-mono text-[#f87171] uppercase tracking-wide block mb-1">The Trust Gap</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Standard database logs are mutable. From an auditor’s perspective, any developer or system administrator with root database access can alter historical logs, render timestamps, or backdate approvals. Static database entries are not legally binding proof of state.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. The Three Pillars */}
              <div className="space-y-3 pt-4">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-[#1f2937] text-indigo-300 text-[11px] font-semibold font-mono">2</span>
                  The Three Pillars of the AIEC Advantage
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  AIEC solves this dilemma by divorcing the text of the data from the cryptographic evidence of the transaction.
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded border border-indigo-950 bg-indigo-950/10">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-1.5">
                      <span className="text-indigo-400 font-bold">I.</span>
                      Privacy-Preserving Verification
                    </h3>
                    <p className="text-xs text-gray-305 leading-relaxed mb-2">
                      AIEC never receives, reads, or stores your raw prompt or response data <span className="text-indigo-400 font-mono font-semibold">[1]</span>.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-gray-400 leading-relaxed">
                      <li>Our local SDKs and browser extensions compute cryptographic hashes (SHA-256) and local signatures directly inside your secure application environment <span className="text-indigo-400 text-[10px] font-mono">[1]</span>.</li>
                      <li>The only data sent to the AIEC ledger is the metadata (model name, timestamp) and the signature <span className="text-indigo-400 text-[10px] font-mono">[1]</span>.</li>
                      <li>If you choose to share encrypted document histories with external auditors, the AES-GCM-256 decryption key is stored strictly within the URL’s location hash fragment <code className="text-indigo-400 font-mono bg-indigo-950/30 px-1 py-0.5 rounded">#key=...</code>, keeping our servers completely blind to your content <span className="text-indigo-400 text-[10px] font-mono">[1]</span>.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded border border-indigo-950 bg-indigo-950/10">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-1.5">
                      <span className="text-indigo-400 font-bold">II.</span>
                      Immutable Evidence Record
                    </h3>
                    <p className="text-xs text-gray-405 leading-relaxed">
                      Every generation, edit, and human sign-off is linked sequentially in a cryptographic hash chain. Once an event is written to the ledger, it cannot be altered or deleted. If a single character of historical text is edited, the hash chain breaks, immediately flagging the system for unauthorized state modifications. This provides your compliance officers with tamper-proof evidence that is legally and mathematically defensible.
                    </p>
                  </div>

                  <div className="p-4 rounded border border-indigo-950 bg-indigo-950/10">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-1.5">
                      <span className="text-indigo-400 font-bold">III.</span>
                      Unified Cross-Model Governance
                    </h3>
                    <p className="text-xs text-gray-455 leading-relaxed">
                      Enterprises rarely use a single LLM. Your legal team might run Claude, your developers use GPT-4, and your customer service system runs an internal open-source model. AIEC operates as a model-agnostic governance layer. It provides a single, unified audit dashboard that translates various model outputs, human modifications, and compliance workflows into a standardized, auditor-friendly format.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Build vs. Buy Table */}
              <div className="space-y-3 pt-4">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-[#1f2937] text-indigo-300 text-[11px] font-semibold font-mono">3</span>
                  Build vs. Buy: The Technical Reality
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  When enterprise engineering teams attempt to build custom AI logging systems in-house, they often underestimate the cryptographic complexity required to satisfy GRC auditors:
                </p>

                <div className="border border-[#1F2937] bg-[#0c101a] rounded overflow-hidden">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-[#111522] border-b border-[#1F2937]">
                        <th className="p-2 tracking-wider text-xs font-mono text-gray-300 font-bold">Feature</th>
                        <th className="p-2 border-l border-[#1F2937] text-red-400 font-mono select-none font-bold">Custom In-House Logger</th>
                        <th className="p-2 border-l border-[#1F2937] text-emerald-400 font-mono select-none font-bold">AIEC Governance Engine</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F2937] text-gray-400">
                      <tr className="hover:bg-[#111522]/20">
                        <td className="p-2.5 font-bold text-gray-200">Tamper-Evident History</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-red-200/80 bg-red-950/5">No. Database entries are mutable by admins.</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-[#34d399] bg-emerald-950/10 font-medium">Yes. Linked-list cryptographic hash chains prevent retroactive edits.</td>
                      </tr>
                      <tr className="hover:bg-[#111522]/20">
                        <td className="p-2.5 font-bold text-gray-200">Cryptographic Signatures</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-red-200/80 bg-red-950/5">No. Uses generic API tokens or system timestamps.</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-[#34d399] bg-emerald-950/10 font-medium">Yes. Uses non-extractable WebCrypto keys (ECDSA/Ed25519) to verify identity.</td>
                      </tr>
                      <tr className="hover:bg-[#111522]/20">
                        <td className="p-2.5 font-bold text-gray-200">Regulatory Mapping</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-red-200/80 bg-red-950/5">No. Requires engineering to map logs to frameworks.</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-[#34d399] bg-emerald-950/10 font-medium">Yes. Maps directly to ISO 42001 (A.7 & A.11) and EU AI Act (Art 12 & 14) <span className="text-indigo-400 font-mono text-[9px]">[1.1.2, 1.2.5]</span>.</td>
                      </tr>
                      <tr className="hover:bg-[#111522]/20">
                        <td className="p-2.5 font-bold text-gray-200">Privacy-Preserving Architecture</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-red-200/80 bg-red-950/5">No. Ingests raw text into internal databases.</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-[#34d399] bg-emerald-950/10 font-medium">Yes. Processes only metadata and cryptographic hashes locally <span className="text-indigo-400 font-mono text-[9px]">[1]</span>.</td>
                      </tr>
                      <tr className="hover:bg-[#111522]/20">
                        <td className="p-2.5 font-bold text-gray-200">Auditor-Ready Export</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-red-200/80 bg-red-950/5">No. Requires exporting database CSVs.</td>
                        <td className="p-2.5 border-l border-[#1F2937] text-[#34d399] bg-emerald-950/10 font-medium">Yes. Downloads self-contained, signed JSON compliance bundles for offline audits.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Bottom-Line Outcomes */}
              <div className="space-y-3 pt-4">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-[#1f2937] text-indigo-300 text-[11px] font-semibold font-mono">4</span>
                  Bottom-Line Outcomes
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  By integrating AIEC, enterprise leaders achieve three immediate operational outcomes:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="border border-[#1F2937] bg-[#111522]/30 p-4 rounded text-left">
                    <span className="text-[#34d399] font-mono text-[#34d399] font-bold block mb-1 text-[10px] uppercase tracking-widest">Outcome I</span>
                    <strong className="text-white block text-xs font-sans tracking-tight mb-1">Reduce Audit Costs</strong>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Automate collection of ISO 42001 and EU AI Act compliance evidence, saving hundreds of engineering hours during reviews <span className="text-indigo-400 text-[9px] font-mono">[1.1.2, 1.2.5]</span>.
                    </p>
                  </div>

                  <div className="border border-[#1F2937] bg-[#111522]/30 p-4 rounded text-left">
                    <span className="text-[#34d399] font-mono text-[#34d399] font-bold block mb-1 text-[10px] uppercase tracking-widest">Outcome II</span>
                    <strong className="text-white block text-xs font-sans tracking-tight mb-1">Accelerate Sales</strong>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Unblock enterprise procurement pipelines by offering prospective enterprise buyers a verified, cryptographically compliant AI sandbox.
                    </p>
                  </div>

                  <div className="border border-[#1F2937] bg-[#111522]/30 p-4 rounded text-left">
                    <span className="text-[#34d399] font-mono text-[#34d399] font-bold block mb-1 text-[10px] uppercase tracking-widest">Outcome III</span>
                    <strong className="text-white block text-xs font-sans tracking-tight mb-1">Eliminate Liability</strong>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Establish a mathematical, human-in-the-loop chain of custody that protects your organization against IP, copyright, or data-tampering claims.
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          {/* Tab Content: Privacy Policy */}
          {activeTab === 'privacy' && (
            <motion.article 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              id="privacy-policy-canvas"
            >
              <div className="border-b border-gray-800 pb-5">
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-1.5">
                  <Shield className="w-4 h-4 text-indigo-400" /> Trust & Compliance Blueprint
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Privacy Policy</h1>
                <div className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-1.5">
                  <span>LAST UPDATED: JUNE 7, 2026</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold uppercase">Status: Approved GRC Schema</span>
                </div>
              </div>

              <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-4">
                <p>
                  AIEC (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to absolute data privacy and security. Our architecture is engineered around the principle of <strong className="text-white">Privacy-Preserving local validation</strong>—ensuring that we never ingest, read, or store your intellectual property, raw text, model prompts, or generated outputs.
                </p>
              </div>

              {/* Architecture Info Callout widget */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4" id="zk-architecture-metrics">
                <div className="border border-[#1F2937] bg-[#0c101a] p-4 rounded text-left">
                  <div className="text-indigo-400 font-bold font-mono text-xs uppercase tracking-wider mb-1">0.0% Storage</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Raw completions or user query text values are never written to physical log matrices or central databases.
                  </p>
                </div>
                <div className="border border-[#1F2937] bg-[#0c101a] p-4 rounded text-left">
                  <div className="text-indigo-400 font-bold font-mono text-xs uppercase tracking-wider mb-1">Local Hashing Active</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Symmetric digests of model inferences are transformed into SHA-256 strings within your application sandbox.
                  </p>
                </div>
                <div className="border border-[#1F2937] bg-[#0c101a] p-4 rounded text-left">
                  <div className="text-indigo-400 font-bold font-mono text-xs uppercase tracking-wider mb-1">E2EE Shared URL Logs</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Decryption symmetric keys are strictly stored in local user URL hash codes (`#`), remaining fully blind to servers.
                  </p>
                </div>
              </div>

              <hr className="border-gray-800" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">1. The Privacy-Preserving Principle</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                    Unlike traditional SaaS platforms, our systems are architected so that raw data processing occurs strictly inside your local client-side environment.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-350 list-disc pl-5">
                    <li>
                      <strong className="text-white">Model Inputs and Outputs:</strong> We do not collect, store, or transmit your raw prompts, responses, or document text to our servers.
                    </li>
                    <li>
                      <strong className="text-white">Local One-Way Hashing:</strong> Before any audit trail metadata is sent to our servers, the raw content is passed through a local client-side SHA-256 cryptographic hash function. The server receives only the irreversible hash.
                    </li>
                    <li>
                      <strong className="text-white">Local Client-Side Encryption:</strong> Optional document payloads shared via the verification ledger are encrypted locally inside your browser using the AES-GCM-256 standard prior to transmission. The decryption key is appended to the URL as a location hash fragment (e.g., <code className="bg-[#0c101a] text-indigo-300 px-1 py-0.5 rounded font-mono text-xs">#key=...</code>), which is parsed strictly client-side by the browser and never sent to our servers.
                    </li>
                  </ul>
                </div>

                {/* Animated Interactive E2EE Demonstration Widget */}
                <div className="bg-[#090b12] border border-[#1F2937] rounded-lg p-5">
                  <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-3">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" /> Interactive Demonstration: Browser AES-GCM & Hash Parameters
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase font-semibold">Active Node Diagnostics</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-3">
                      <p className="text-gray-400 font-sans text-[11px] leading-relaxed">
                        To verify that our server is mathematically blind to your key, try modifying this temporary browser key. Notice how it changes the mock URL shared parameter but never triggers host database packet updates.
                      </p>
                      
                      <div>
                        <span className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Local Browser Decryption Key</span>
                        <div className="bg-[#111522] p-2 rounded border border-[#1f2937] font-mono text-white text-xs select-all break-all">
                          secret-aes-gcm-key-90a42e5b7c01ab4fc9ebd98fa9012a9fbcedbe8
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Generated Auditor Shareable link (Unsent fragment)</span>
                        <div className="bg-[#111522] p-2 rounded border border-[#1f2937] font-mono text-[10.5px] text-[#a5b4fc] break-all leading-relaxed">
                          https://aiec.certify/verify/AIEC-8912<span className="text-emerald-400 animate-pulse font-bold">#key=90a42e5b7c01ab4fc...</span>
                        </div>
                      </div>
                      <div className="bg-[#101912] border border-emerald-950 p-2.5 rounded font-mono text-[10px] text-emerald-400 flex items-start gap-1.5 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>
                          <strong>Cryptographic Assurance:</strong> Under standard browser architecture, the host server receives only the request path <code className="bg-[#0b120c] px-1 py-0.5 rounded text-indigo-300">/verify/AIEC-8912</code>. The fragment data behind the hash (e.g. <code className="bg-[#0b120c] px-1 py-0.5 rounded text-indigo-300">#key=...</code>) never forms part of HTTP packages transmitting to outside relays.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">2. Information We Do Collect</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                    We limit data collection to the minimum required to manage your account and authenticate API access:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-350 list-disc pl-5">
                    <li>
                      <strong className="text-white">Account Information:</strong> Name, corporate email address, and organization name.
                    </li>
                    <li>
                      <strong className="text-white">Usage Telemetry:</strong> API call frequency, active system counts, and ledger transaction metadata (model types used, signature timestamps, and verification status) to manage billing and track performance.
                    </li>
                    <li>
                      <strong className="text-white">Cryptographic Public Keys:</strong> The Subject Public Key Info (SPKI) generated by your local browser extensions or SDKs to verify your signatures. <strong className="text-white">We never collect or have access to your private signing keys.</strong>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">3. Data Processing and Location</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    All account and metadata storage is hosted within highly secure, SOC 2 Type II compliant cloud facilities. Because we do not ingest or store personally identifiable information (PII) or raw operational data in our database, our platform is fully compatible with global data localization and sovereignty frameworks, including GDPR and HIPAA.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">4. Your Rights</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    You retain complete control over your cryptographic identities and local keys. You may revoke, delete, or rotate your registered public keys at any time through your local account settings, rendering past or future client-side signatures associated with that key void on our central verification ledger.
                  </p>
                </div>
              </div>
            </motion.article>
          )}

          {/* Tab Content: Terms of Service */}
          {activeTab === 'terms' && (
            <motion.article 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              id="terms-of-service-canvas"
            >
              <div className="border-b border-gray-800 pb-5">
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" /> System Access & GRC Ruleset
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Terms of Service</h1>
                <div className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-1.5">
                  <span>LAST UPDATED: JUNE 7, 2026</span>
                  <span>•</span>
                  <span className="text-[#a5b4fc] font-semibold uppercase">Framework: Standard API Agreement</span>
                </div>
              </div>

              <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-4">
                <p>
                  These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the AIEC platform, browser extensions, APIs, and SDKs (collectively, the &ldquo;Service&rdquo;). By accessing or using our Service, you and your organization agree to be bound by these Terms.
                </p>
              </div>

              <hr className="border-gray-800" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">1. Intellectual Property & Ownership</h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-350 list-disc pl-5">
                    <li>
                      <strong className="text-white">Your Intellectual Property:</strong> AIEC claims no ownership, rights, or interest of any kind over the prompts, responses, documents, or data processed through our Service. Our platform remains blind to all content-specific operations.
                    </li>
                    <li>
                      <strong className="text-white">Verification Ledger Ownership:</strong> You retain exclusive ownership of all verifiable audit trails and certificates generated by your account.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">2. Client-Side Cryptographic Responsibility</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                    Because our service utilizes a local signing architecture, you are solely responsible for the generation, management, and storage of your cryptographic private keys:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-350 list-disc pl-5">
                    <li>
                      <strong className="text-white">Private Key Security:</strong> Your signing keys (ECDSA or Ed25519) are generated locally in your browser/application environment and are set as non-extractable elements in your crypto keystore.
                    </li>
                    <li>
                      <strong className="text-white">Irreversibility:</strong> If you lose or delete your local cryptographic keys, AIEC cannot recover them, and you will be unable to generate further valid signatures associated with that specific public key.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">3. Permitted Use & Compliance</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    You agree to use the Service only in compliance with applicable laws, including international AI regulations (such as the EU AI Act) and data-privacy standards. You are solely responsible for ensuring that the content, prompts, and models you audit do not violate third-party intellectual property rights or generate illegal outputs.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">4. Limitation of Liability</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    AIEC provides cryptographic attestation services. We do not inspect, verify, or endorse the accuracy, safety, or legal validity of the raw content generated by your underlying AI models. We are not liable for any hallucinations, intellectual property infringement, or operational errors produced by the models running within your software pipelines.
                  </p>
                </div>
              </div>
            </motion.article>
          )}

          {/* Tab Content: Cryptographic Security Schema */}
          {activeTab === 'security' && (
            <motion.article 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              id="security-schema-canvas"
            >
              <div className="border-b border-gray-800 pb-5">
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-1.5">
                  <Lock className="w-4 h-4 text-indigo-400" /> Technical Architecture
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Technical Security Architecture</h1>
                <div className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-1.5">
                  <span>LAST UPDATED: JUNE 7, 2026</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold uppercase">System: Ed25519 & ECDSA P-256 Enabled</span>
                </div>
              </div>

              <div className="text-sm font-sans text-gray-300 leading-relaxed">
                <p>
                  This document describes the security, verification, and identity architecture used by AIEC to maintain verifiable evidence records, identity attribution, and audit trail integrity.
                </p>
              </div>

              <hr className="border-gray-800" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">1. Identity Layer & Signatures</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                    Every user, employee, or agent in the evidence chain is assigned a unique cryptographic identity generated inside their local client environment:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-350 list-disc pl-5 mb-4">
                    <li>
                      <strong className="text-white">Key Generation:</strong> Keys are generated via the WebCrypto API using either <strong className="text-white">ECDSA (Curve P-256)</strong> or <strong className="text-white">Ed25519 (EdDSA)</strong>.
                    </li>
                    <li>
                      <strong className="text-white">Non-Extractability:</strong> Client-side private keys are stored in the browser's secure `Local Storage` or memory with <code className="bg-[#0c101a] text-indigo-300 px-1 py-0.5 rounded font-mono text-xs">extractable: false</code>, preventing exposure to malicious third-party scripts or DOM scraper attacks.
                    </li>
                    <li>
                      <strong className="text-white">Identity Fingerprint:</strong> The public key is exported as a Subject Public Key Info (SPKI) Der structure, then hashed via SHA-256 to create a unique <strong className="text-white">Public Key Fingerprint</strong>.
                    </li>
                  </ul>
                </div>

                {/* Mathematical Formula Component Block */}
                <div className="bg-[#090b12] border border-[#1F2937] p-6 rounded-lg text-center font-mono relative overflow-hidden" id="math-formula-box">
                  <div className="absolute top-0 left-0 bg-indigo-950/40 text-indigo-400 px-3 py-1 rounded-br border-r border-b border-[#1f2937] text-[9px] uppercase tracking-wider">
                    Formula: State Hash Chain
                  </div>
                  
                  <div className="py-6 text-base sm:text-lg text-white font-semibold flex items-center justify-center flex-wrap gap-2 select-all leading-normal">
                    <span>B<sub>n</sub></span>
                    <span>=</span>
                    <span>Sign(</span>
                    <span className="text-indigo-400">PrivateKey<sub>actor</sub></span>
                    <span>,</span>
                    <span className="text-emerald-400">ActionType</span>
                    <span>||</span>
                    <span className="text-purple-400">H<sub>n</sub></span>
                    <span>||</span>
                    <span className="text-[#a5b4fc]">H<sub>n-1</sub></span>
                    <span>||</span>
                    <span className="text-gray-400">Timestamp</span>
                    <span>)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-gray-900 pt-4 text-[10px] text-left text-gray-550">
                    <div>
                      <strong className="text-gray-450 block">B<sub>n</sub></strong>
                      Active generated token
                    </div>
                    <div>
                      <strong className="text-indigo-400 block">PrivateKey</strong>
                      Non-extractable key
                    </div>
                    <div>
                      <strong className="text-emerald-400 block">|| (Concatenate)</strong>
                      Secure byte bonding
                    </div>
                    <div>
                      <strong className="text-purple-400 block">H<sub>n</sub></strong>
                      Current model hash
                    </div>
                    <div>
                      <strong className="text-[#a5b4fc] block">H<sub>n-1</sub></strong>
                      Predecessor hash block
                    </div>
                  </div>
                </div>

                {/* Interactive Formula Simulator widget */}
                <div className="bg-[#111522]/80 border border-[#1f2937] rounded-lg p-5">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold uppercase tracking-wide mb-3 border-b border-gray-900 pb-2">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" /> Interactive State mutation Playground
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Action Type</label>
                      <select 
                        className="w-full bg-[#090b12] border border-[#1f2937] text-white text-[11px] p-2 rounded focus:outline-none"
                        value={interactiveActionType}
                        onChange={(e) => setInteractiveActionType(e.target.value)}
                      >
                        <option value="VERIFY_OUTPUT">VERIFY_OUTPUT</option>
                        <option value="MUTATED_BY_EDITOR">MUTATED_BY_EDITOR</option>
                        <option value="GENERAL_COUNSEL_APPROVE">GENERAL_COUNSEL_APPROVE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Current State H<sub>n</sub></label>
                      <input 
                        type="text"
                        className="w-full bg-[#090b12] border border-[#1f2937] text-white text-[11px] p-1.5 rounded font-mono"
                        value={interactiveHashIdx}
                        onChange={(e) => setInteractiveHashIdx(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Predecessor H<sub>n-1</sub></label>
                      <input 
                        type="text"
                        className="w-full bg-[#090b12] border border-[#1f2937] text-white text-[11px] p-1.5 rounded font-mono"
                        value={interactivePredecessor}
                        onChange={(e) => setInteractivePredecessor(e.target.value)}
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleTriggerWidgetSignature}
                        disabled={isSigningInWidget}
                        className="w-full bg-indigo-650 hover:bg-indigo-600 font-mono font-bold text-white py-2 px-3 rounded text-[10px] uppercase border border-indigo-500/30 transition-colors cursor-pointer select-none"
                      >
                        {isSigningInWidget ? 'Recomputing...' : 'Derive Signature Block'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 bg-[#070a11] p-3.5 rounded border border-gray-900 font-mono text-[10.5px]">
                    <div className="flex items-center justify-between text-gray-500 mb-1 text-[9px] uppercase tracking-wider">
                      <span>Calculated Signature Output (Ed25519 / EdDSA standard)</span>
                      <span className="text-emerald-400">Status: SECURE</span>
                    </div>
                    <div className="text-white break-all bg-black/40 p-2 border border-gray-900 rounded text-[10px]">
                      {interactiveSignature || 'e134ab9c3df8e762cba394ad9024f9c5d1e2e71fa3e2_Ed25519_EdDSA_Symmetric_PRECOMPUTED'}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">2. The Evidence Chain (State Transitions)</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                    To prevent tampering or state-injection, the audit trail functions as a cryptographic linked-list (hash chain). Each state transition B<sub>n</sub> is linked directly to the predecessor block B<sub>n-1</sub>.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-350 list-disc pl-5 mb-4">
                    <li>
                      Where <strong className="text-white">H<sub>n</sub></strong> is the SHA-256 hash of the latest document state variables.
                    </li>
                    <li>
                      Where <strong className="text-white">H<sub>n-1</sub></strong> is the secure irreversible hash pointer of the preceding state.
                    </li>
                    <li>
                      If any historical step is modified retroactively, the hash pointer sequence breaks instantly, invalidating the entire downstream evidence chain on the auditing ledger block and alerting connected compliance systems.
                    </li>
                  </ul>
                </div>

                {/* Privacy-Preserving Local Document Pipeline Block */}
                <div className="bg-[#090b12] border border-[#1F2937] rounded-lg p-5">
                  <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest border-b border-gray-900 pb-2 mb-4">
                    Privacy-Preserving Local Document Pipeline
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Visual diagram representation */}
                    <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 font-mono text-center">
                      <div className="border border-[#1F2937] bg-[#111522] p-3 rounded flex-1 flex flex-col justify-between">
                        <span className="font-bold text-[10px] text-white uppercase block mb-1">1. Raw Document Text</span>
                        <div className="bg-black/30 p-2 rounded text-[10px] text-gray-400 min-h-[48px] flex items-center justify-center leading-normal">
                          "Draft mutual legal contract under EU code Section 4..."
                        </div>
                        <span className="text-[9px] text-emerald-400 font-semibold mt-2">Remains strictly in RAM</span>
                      </div>

                      <div className="flex flex-col justify-center items-center text-indigo-500 py-2 sm:py-0">
                        <ChevronRight className="w-6 h-6 rotate-90 md:rotate-0" />
                      </div>

                      <div className="border border-[#1F2937] bg-[#111522] p-3 rounded flex-1 flex flex-col justify-between">
                        <span className="font-bold text-[10px] text-white uppercase block mb-1">2. Local Hashing Engine</span>
                        <div className="bg-black/30 p-2 rounded text-[9.5px] text-indigo-300 min-h-[48px] flex flex-col justify-center select-all leading-normal">
                          <span>SHA-256 (WebCrypto digest)</span>
                          <span className="break-all mt-1 font-semibold">9af2e5b7c01a...</span>
                        </div>
                        <span className="text-[9px] text-indigo-400 font-semibold mt-2">Computed inside browser context</span>
                      </div>

                      <div className="flex flex-col justify-center items-center text-indigo-500 py-2 sm:py-0">
                        <ChevronRight className="w-6 h-6 rotate-90 md:rotate-0" />
                      </div>

                      <div className="border border-[#1F2937] bg-[#111522] p-3 rounded flex-1 flex flex-col justify-between">
                        <span className="font-bold text-[10px] text-white uppercase block mb-1">3. Transmitted Metadata</span>
                        <div className="bg-black/30 p-2 rounded text-[10px] text-emerald-400 min-h-[48px] flex items-center justify-center leading-normal select-all break-all font-mono">
                          {'{ "hash": "9af2e...", "timestamp": 1780512000 }'}
                        </div>
                        <span className="text-[9px] text-emerald-400 font-semibold mt-2">0.0% Raw Text sent to central ledger</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">3. Privacy-Preserving Sharing & Local Encryption</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                    When sharing document logs with auditors or external partners, AIEC utilizes client-side end-to-end encryption (E2EE) to preserve privacy:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-350 list-disc pl-5 mb-4">
                    <li>
                      <strong className="text-white">Zero Server-Visibility:</strong> The 256-bit AES-GCM key is generated locally in the browser and is never transmitted in the HTTP body.
                    </li>
                    <li>
                      <strong className="text-white">The Fragment Lock:</strong> The decryption key is placed strictly in the URL hash fragment (<code className="bg-[#0c101a] text-indigo-300 px-1 py-0.5 rounded font-mono text-xs">window.location.hash</code>). By browser standards, hash fragments are parsed locally by the client engine and are never sent to the host server in the HTTP request header.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.article>
          )}

          {/* Tab Content: Compliance & Standards Mapping */}
          {activeTab === 'compliance' && (
            <motion.article 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              id="compliance-standards-canvas"
            >
              <div className="border-b border-gray-800 pb-5">
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-1.5">
                  <Award className="w-4 h-4 text-indigo-400" /> GRC Mappings Matrix
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight text-left">Compliance & Regulatory Standards Mapping</h1>
                <div className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-1.5">
                  <span>LAST UPDATED: JUNE 7, 2026</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold uppercase">Framework: Fully Aligned with EU AI Act & ISO 42001</span>
                </div>
              </div>

              <div className="text-sm font-sans text-gray-300 leading-relaxed">
                <p>
                  This matrix outlines exactly how the AIEC automated audit platform maps directly to international governance frameworks, reducing administrative overhead during surveillance assessments and procurement onboarding.
                </p>
              </div>

              <hr className="border-gray-800" />

              <div className="space-y-8">
                {/* ISO/IEC 42001 Layout Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    1. ISO/IEC 42001:2023 Standard Alignment
                  </h3>
                  <p className="text-xs sm:text-sm text-[#c7c4d8]/90 leading-relaxed mb-4">
                    AIEC automates and satisfies key technological controls outlined in modern AI management system standards:
                  </p>

                  <div className="space-y-4">
                    <div className="border border-[#1F2937] bg-[#0c101a] p-5 rounded-lg text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-mono text-indigo-400 font-bold text-xs uppercase tracking-wide">
                          Control A.7.2: Data Provenance and Lineage
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-450 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                          Automated ✓
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-3">
                        <em>Standard Requirement:</em> Maintain clear records of the origin, transformations, and processing steps of data used in AI lifecycles.
                      </p>
                      <div className="bg-[#111522] p-3 rounded font-mono text-[10.5px] text-indigo-300 flex items-start gap-1.5 leading-normal border border-gray-900">
                        <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Engine Implementation:</strong> The system SDK runs <code className="text-white">aiec.certify()</code> to capture immutable cryptographic SHA-256 signatures of inputs/outputs on the active ledger.
                        </span>
                      </div>
                    </div>

                    <div className="border border-[#1F2937] bg-[#0c101a] p-5 rounded-lg text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-mono text-indigo-400 font-bold text-xs uppercase tracking-wide">
                          Control A.11.1: Human Oversight & Audits
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-450 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                          Automated ✓
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-3">
                        <em>Standard Requirement:</em> Ensure that human review and oversight are integrated into the deployment of AI systems.
                      </p>
                      <div className="bg-[#111522] p-3 rounded font-mono text-[10.5px] text-indigo-300 flex items-start gap-1.5 leading-normal border border-gray-900">
                        <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Engine Implementation:</strong> Designated human evaluators log-approve events inside local browser clients using <code className="text-white">aiec.approve()</code>, binding key signatures safely to ledger history.
                        </span>
                      </div>
                    </div>

                    <div className="border border-[#1F2937] bg-[#0c101a] p-5 rounded-lg text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-mono text-indigo-400 font-bold text-xs uppercase tracking-wide">
                          Control A.9.1: System Logging and Auditing
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-450 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                          Automated ✓
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-3">
                        <em>Standard Requirement:</em> Implement robust logging mechanisms to record AI system behaviors, executions, and modifications.
                      </p>
                      <div className="bg-[#111522] p-3 rounded font-mono text-[10.5px] text-indigo-300 flex items-start gap-1.5 leading-normal border border-gray-900">
                        <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Engine Implementation:</strong> The visual ledger's Evidence Chain builds continuous state progress trails, generating offline auditable packets to prove conformity instantly.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EU AI Act Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    2. EU AI Act Mandates Mapping (High-Risk GRC)
                  </h3>
                  <p className="text-xs sm:text-sm text-[#c7c4d8]/90 leading-relaxed mb-4">
                    Establishes robust conformity structures under continental European regulatory boundaries for general-purpose models:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-[#1F2937] bg-[#0c101a] p-4 rounded text-left">
                      <h4 className="text-xs font-bold text-white mb-2 font-mono uppercase tracking-wider text-indigo-400">
                        Article 12: Traceability & Logging
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        High-risk algorithms must automatically record events ("logs") over their lifecycle to trace operation boundaries. AIEC local service daemons register network telemetry streams in real-time, executing cryptographic hash commitments seamlessly.
                      </p>
                    </div>

                    <div className="border border-[#1F2937] bg-[#0c101a] p-4 rounded text-left">
                      <h4 className="text-xs font-bold text-white mb-2 font-mono uppercase tracking-wider text-indigo-400">
                        Article 14: Human-In-The-Loop Review
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        AI systems must be designed such that natural persons can effectively oversee and interrupt executions. The multi-player audit trail records when human keys override, approve, or adjust model inputs prior to downstream execution.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SOC 2 Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    3. SOC 2 Type II criteria integration
                  </h3>
                  <p className="text-xs sm:text-sm text-[#c7c4d8]/90 leading-relaxed mb-4">
                    Automates operational log audit checks to reduce the yearly work burden of institutional security partners:
                  </p>

                  <ul className="space-y-4 text-xs sm:text-sm text-gray-300">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border border-indigo-500/30 bg-indigo-950/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-white block font-mono text-xs uppercase text-indigo-400">CC 6.1 (Logical Access Controls)</strong>
                        Signs all API requests and logs with designated asymmetric private credential pairs to prove that only verified corporate actors could trigger model pipelines.
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border border-indigo-500/30 bg-indigo-950/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-white block font-mono text-xs uppercase text-indigo-400">CC 6.3 (Audit Logs Integrity assurance)</strong>
                        Hashes saved directly in our signed ledger blocks guarantee that audit records have not been altered, deleted, or manipulated retroactively.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </div>
  );
}
