import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Loader2, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface RSVPFormProps {
  inviteeName?: string;
  eventName?: string;
  eventParam?: string;
  sideParam?: string;
}

const parseSideParam = (param?: string) => {
  if (!param) return '';
  const lower = param.toLowerCase();
  if (lower.includes('himodya')) return "Himodya's Side (Groom)";
  if (lower.includes('mihiri')) return "Mihiri's Side (Bride)";
  return '';
};

export const RSVPForm: React.FC<RSVPFormProps> = ({
  inviteeName = '',
  eventName = 'the celebration',
  eventParam = 'both',
  sideParam = '',
}) => {
  const [formData, setFormData] = useState({
    fullName: inviteeName,
    side: parseSideParam(sideParam),
    guests: '1',
    dietaryNotes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwCVXxys2Qx9MGE86kVD6_cahmfqySgtRArABsppi9_IiGrs1H8xPc9gzFqPbaivFiy/exec";

  useEffect(() => {
    if (inviteeName) {
      setFormData(prev => ({ ...prev, fullName: inviteeName }));
    }
  }, [inviteeName]);

  useEffect(() => {
    if (sideParam) {
      const parsed = parseSideParam(sideParam);
      if (parsed) {
        setFormData(prev => ({ ...prev, side: parsed }));
      }
    }
  }, [sideParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.side) {
      toast.error("Please select whether you are attending from Mihiri's side (Bride) or Himodya's side (Groom).");
      return;
    }

    setStatus('loading');

    try {
      const payload = new FormData();
      payload.append('sheet', 'RSVP');
      payload.append('fullName', formData.fullName);
      payload.append('side', formData.side);
      payload.append('guestSide', formData.side);
      payload.append('guests', formData.guests);
      payload.append('dietaryNotes', formData.dietaryNotes);

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
      });

      setStatus('success');
      toast.success('Your RSVP has been warmly received!');
      setFormData({
        fullName: inviteeName,
        side: parseSideParam(sideParam),
        guests: '1',
        dietaryNotes: '',
      });
    } catch (error) {
      console.error('Error sending RSVP: ', error);
      setStatus('error');
      toast.error('Could not submit RSVP. Please try again.');
    }
  };

  return (
    <div className="w-full bg-[#020035] text-white relative">
      <div className="max-w-5xl mx-auto px-6 relative py-12 lg:py-16">
        {/* Premium ambient backdrop & glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-white/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="p-10 sm:p-14 lg:p-16 rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden bg-white/5 backdrop-blur-2xl lg:flex items-center gap-16"
        >
          {/* Soft top border line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-rose via-brand-lavender to-brand-plum" />

          {/* Left Side: Elegant Text */}
          <div className="lg:w-1/2 lg:pr-10 mb-12 lg:mb-0 relative text-center lg:text-left">
            <Sparkles className="absolute -top-6 -left-6 w-12 h-12 text-white/30 animate-pulse" />

            <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-6">
              <span className="text-white uppercase tracking-[0.5em] text-[10px] sm:text-[11px] font-bold drop-shadow-sm">
                Kindly Respond
              </span>
              <div className="hidden lg:block w-16 h-[1px] bg-gradient-to-r from-white/60 to-transparent" />
            </div>

            <h2 className="text-5xl sm:text-6xl font-display text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
              Reserve <span className="italic font-light text-white/80">Your</span> Seat
            </h2>

            <p className="text-white/80 font-serif text-lg leading-relaxed mb-6">
              {inviteeName
                ? `Dear ${inviteeName}, your presence at ${eventName} means the world to us. Please kindly let us know if you will be able to join our celebration.`
                : `Your presence means the world to us. Please kindly let us know if you will be able to join our celebration.`
              }
            </p>
            <div className="mt-6 mb-8 text-sm font-sans tracking-[0.2em] uppercase font-semibold text-white drop-shadow-sm leading-loose">
              RSVP BY 1st November 2026<br />
              071-3449391 - Himodya <br /> 
              077-1932004 - Mihiri
            </div>
            <div className="w-12 h-[1px] bg-white/30 mx-auto lg:mx-0" />
          </div>

        {/* Right Side: Flowing Form */}
        <div className="lg:w-1/2 relative z-10">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16 px-8 bg-white/10 rounded-[2rem] border border-white/20 shadow-xl"
              >
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-400/30">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-4xl font-display text-white mb-4 tracking-tight drop-shadow-sm">With Gratitude</h3>
                <p className="text-white/80 leading-relaxed font-serif text-lg mb-8">
                  Your response has been warmly received. We cannot wait to celebrate with you!
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 rounded-full border border-white/30 text-white font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-white/10 transition-all duration-300 shadow-sm"
                >
                  Update Response
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 bg-white/5 p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
              >
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-3 ml-2">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="E.g., John & Jane Doe"
                    className="w-full bg-white/10 text-white placeholder:text-white/40 px-6 py-4 rounded-full border border-white/20 focus:ring-2 focus:ring-white/40 focus:border-white/50 outline-none transition-all duration-300 font-serif italic text-lg shadow-inner"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-3 ml-2 flex items-center justify-between">
                    <span>
                      Guest Of <span className="text-brand-rose">*</span>
                    </span>
                    {formData.side && (
                      <span className="text-white/80 font-serif italic text-xs tracking-normal font-normal">
                        {formData.side}
                      </span>
                    )}
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, side: "Mihiri's Side (Bride)" }))}
                      className={`group relative py-3.5 sm:py-4 px-2 sm:px-4 rounded-2xl sm:rounded-full border text-center transition-all duration-300 font-serif text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 outline-none cursor-pointer ${
                        formData.side === "Mihiri's Side (Bride)"
                          ? 'bg-white text-[#020035] border-white font-semibold shadow-[0_8px_25px_rgba(255,255,255,0.25)] scale-[1.02]'
                          : 'bg-white/10 text-white/85 border-white/20 hover:bg-white/15 hover:border-white/40 active:scale-[0.98]'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                          formData.side === "Mihiri's Side (Bride)"
                            ? 'fill-[#020035] text-[#020035] scale-110'
                            : 'text-white/40 group-hover:text-white/70 group-hover:scale-110'
                        }`}
                      />
                      <span className="flex flex-col sm:flex-row items-center sm:gap-1.5 leading-tight">
                        <span>Mihiri's Side</span>
                        <span className={`text-[11px] sm:text-xs font-sans tracking-normal font-normal ${
                          formData.side === "Mihiri's Side (Bride)" ? 'text-[#020035]/70 font-medium' : 'text-white/60'
                        }`}>(Bride)</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, side: "Himodya's Side (Groom)" }))}
                      className={`group relative py-3.5 sm:py-4 px-2 sm:px-4 rounded-2xl sm:rounded-full border text-center transition-all duration-300 font-serif text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 outline-none cursor-pointer ${
                        formData.side === "Himodya's Side (Groom)"
                          ? 'bg-white text-[#020035] border-white font-semibold shadow-[0_8px_25px_rgba(255,255,255,0.25)] scale-[1.02]'
                          : 'bg-white/10 text-white/85 border-white/20 hover:bg-white/15 hover:border-white/40 active:scale-[0.98]'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                          formData.side === "Himodya's Side (Groom)"
                            ? 'fill-[#020035] text-[#020035] scale-110'
                            : 'text-white/40 group-hover:text-white/70 group-hover:scale-110'
                        }`}
                      />
                      <span className="flex flex-col sm:flex-row items-center sm:gap-1.5 leading-tight">
                        <span>Himodya's Side</span>
                        <span className={`text-[11px] sm:text-xs font-sans tracking-normal font-normal ${
                          formData.side === "Himodya's Side (Groom)" ? 'text-[#020035]/70 font-medium' : 'text-white/60'
                        }`}>(Groom)</span>
                      </span>
                    </button>
                  </div>
                  {!formData.side && (
                    <p className="text-white/45 text-[11px] font-serif italic mt-2 ml-2">
                      Please select whether you are attending from Mihiri's side (Bride) or Himodya's side (Groom)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-3 ml-2">Number of Guests</label>
                  <div className="relative group">
                    <select
                      className="w-full bg-white/10 text-white px-6 py-4 rounded-full border border-white/20 focus:ring-2 focus:ring-white/40 focus:border-white/50 outline-none transition-all duration-300 appearance-none font-serif italic text-lg shadow-inner cursor-pointer"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    >
                      <option value="1" className="text-stone-800">Just Me (1 Guest)</option>
                      <option value="2" className="text-stone-800">We are coming! (2 Guests)</option>
                      <option value="3" className="text-stone-800">3 Guests</option>
                      <option value="4" className="text-stone-800">4 Guests</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/60 transition-transform duration-300 group-hover:scale-110">
                      <Heart className="w-5 h-5 fill-white/20 drop-shadow-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-3 ml-2">Dietary Notes (Optional)</label>
                  <textarea
                    placeholder="We'd love to know if you have any allergies..."
                    className="w-full bg-white/10 text-white placeholder:text-white/40 px-6 py-4 rounded-[2rem] border border-white/20 focus:ring-2 focus:ring-white/40 focus:border-white/50 outline-none transition-all duration-300 h-28 resize-none font-serif italic text-lg shadow-inner"
                    value={formData.dietaryNotes}
                    onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={status === 'loading'}
                    type="submit"
                    className="w-full bg-white text-[#020035] py-5 rounded-full font-sans tracking-[0.3em] font-bold text-[11px] uppercase hover:bg-stone-200 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Confirm Attendance'
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      </div>
    </div>
  );
};
