import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { legalAPI } from '@/api';
import { Scale, Shield, ShieldOff, ArrowLeft, Loader2 } from 'lucide-react';

export default function LegalDetail() {
  const { id } = useParams();
  const [section, setSection] = useState<any>(null);
  const [bail, setBail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([legalAPI.getById(Number(id)), legalAPI.checkBail(Number(id))])
      .then(([s, b]) => { setSection(s.data); setBail(b.data); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
      <main className=" flex-1 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin" style={{ color: '#d4a847' }} />
      </main>
    
  );


  return (
      <main className="w-full flex-1">
        <div className="max-w-2xl mx-auto">
          <Link to="/legal" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 md:mb-6">
            <ArrowLeft size={16} />Back to Legal Sections
          </Link>

          <div className="glass-card rounded-xl p-6 animate-fade-in">
            <div className="flex items-start gap-4 mb-4 md:mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center icon-box">
                <Scale size={24} style={{ color: '#d4a847' }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">{section.code}</h1>
                  <span className="text-xs px-2 py-0.5 rounded-full text-foreground"
                        style={{ background: section.actType === 'IPC' ? 'rgba(59,130,246,0.4)' : 'rgba(168,85,247,0.4)' }}>
                    {section.actType}
                  </span>
                </div>
                <p className="text-lg text-foreground">{section.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-input">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Full Description</p>
                <p className="text-sm text-foreground leading-relaxed">{section.description}</p>
              </div>

              {/* Bail Eligibility Indicator */}
              <div className={`p-4 rounded-xl border-2 flex items-center gap-4 animate-pulse-glow ${bail?.eligible ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bail?.eligible ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {bail?.eligible ? <Shield size={24} className="text-green-400" /> : <ShieldOff size={24} className="text-red-400" />}
                </div>
                <div>
                  <p className={`font-bold text-lg ${bail?.eligible ? 'text-green-400' : 'text-red-400'}`}>
                    {bail?.eligible ? 'Bailable Offence' : 'Non-Bailable Offence'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bail?.eligible
                      ? 'The accused is entitled to bail as a matter of right'
                      : 'Bail is at the discretion of the court only'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}