/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Star, 
  Compass, 
  Loader2,
  Heart,
  Briefcase,
  Activity,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

// Days configuration based on Myanmar Astrology
const DAYS_OF_WEEK = [
  { id: 'sunday', label: 'တနင်္ဂနွေ', color: 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100', icon: '☀️' },
  { id: 'monday', label: 'တနင်္လာ', color: 'border-yellow-200 text-yellow-700 bg-yellow-50 hover:bg-yellow-100', icon: '🌙' },
  { id: 'tuesday', label: 'အင်္ဂါ', color: 'border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100', icon: '🦁' },
  { id: 'wednesday', label: 'ဗုဒ္ဓဟူး (နေ့)', color: 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100', icon: '🐘' },
  { id: 'rahu', label: 'ရာဟု (ဗုဒ္ဓဟူး ည)', color: 'border-gray-300 text-gray-800 bg-gray-100 hover:bg-gray-200', icon: '🐗' },
  { id: 'thursday', label: 'ကြာသပတေး', color: 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100', icon: '🐀' },
  { id: 'friday', label: 'သောကြာ', color: 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100', icon: '🐹' },
  { id: 'saturday', label: 'စနေ', color: 'border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100', icon: '🐉' }
];

interface HoroscopeResult {
  day: string;
  overall_luck_percentage: number;
  general_prediction: string;
  business_and_finance: string;
  love_and_relationship: string;
  health: string;
  lucky_colors: string[];
  lucky_numbers: number[];
  avoid_directions: string[];
  yadayar_remedy: string;
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState(DAYS_OF_WEEK[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HoroscopeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetHoroscope = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `ယနေ့အတွက် ${selectedDay.label} သားသမီးများ၏ တစ်နေ့စာ ဟောစာတမ်းကို အသေးစိတ် ဟောကြားပေးပါ။`,
        config: {
          systemInstruction: `You are an elite Myanmar astrologer (နာမည်ကြီး မြန်မာ့ဗေဒင်ပညာရှင်).
          Provide a detailed, highly accurate daily horoscope for a person born on the requested day of the week.
          The prediction should be for TODAY (Current Date: ${new Date().toLocaleDateString()}).
          Use traditional Myanmar astrological concepts (Mahabote, Natkhat) combined with practical advice.
          Tone: Professional, mysterious, encouraging, and culturally authentic Burmese.
          Output MUST be in Burmese language.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              overall_luck_percentage: { type: Type.NUMBER },
              general_prediction: { type: Type.STRING },
              business_and_finance: { type: Type.STRING },
              love_and_relationship: { type: Type.STRING },
              health: { type: Type.STRING },
              lucky_colors: { type: Type.ARRAY, items: { type: Type.STRING } },
              lucky_numbers: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              avoid_directions: { type: Type.ARRAY, items: { type: Type.STRING } },
              yadayar_remedy: { type: Type.STRING }
            },
            required: [
              "day", "overall_luck_percentage", "general_prediction", 
              "business_and_finance", "love_and_relationship", "health", 
              "lucky_colors", "lucky_numbers", "avoid_directions", "yadayar_remedy"
            ]
          }
        }
      });

      const text = response.text;
      if (text) {
        setResult(JSON.parse(text));
      } else {
        throw new Error("No response from AI");
      }
    } catch (err) {
      console.error(err);
      setError("ဟောစာတမ်း တွက်ချက်မှုတွင် အမှားအယွင်းရှိနေပါသည်။ ခေတ္တစောင့်ဆိုင်းပြီး ပြန်လည်ကြိုးစားပေးပါ။");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#4a3b2b] font-sans selection:bg-amber-200 pb-20">
      {/* Decorative Header */}
      <header className="bg-[#2a1b38] text-amber-100 py-12 px-4 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="flex flex-wrap justify-around gap-10 p-10">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
              >
                <Star size={24} />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight flex items-center justify-center gap-4 text-amber-400">
              <Compass className="text-amber-500 animate-[spin_10s_linear_infinite]" size={48} />
              ၇ ရက်သား/သမီး ဟောစာတမ်း
            </h1>
            <p className="text-amber-200/80 text-xl font-light italic">
              ရိုးရာနက္ခတ်ဗေဒင်နှင့် ယတြာလမ်းညွှန် တစ်နေ့စာဟောစာတမ်း
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        
        {/* Day Selection Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-amber-100/50 mb-10"
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-3 text-gray-800">
            <Calendar className="text-amber-600" size={28} />
            မိမိမွေးဖွားရာ နေ့နံကို ရွေးချယ်ပါ
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day)}
                className={`group py-5 px-3 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                  selectedDay.id === day.id 
                  ? 'border-amber-500 bg-amber-50 scale-105 shadow-lg ring-4 ring-amber-500/10' 
                  : `${day.color} border-transparent`
                }`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{day.icon}</span>
                <span className="font-bold text-base">{day.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleGetHoroscope}
              disabled={isLoading}
              className="group relative w-full md:w-3/4 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold py-5 rounded-[2rem] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={28} />
                  ဟောစာတမ်း တွက်ချက်နေပါသည်...
                </>
              ) : (
                <>
                  <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                  {selectedDay.label}အတွက် ဟောစာတမ်းဖတ်မည်
                </>
              )}
            </button>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 font-medium mt-6 text-center bg-red-50 p-3 rounded-xl border border-red-100"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key={result.day}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              
              {/* General Prediction & Luck */}
              <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                  <Compass size={240} />
                </div>
                
                <div className="flex flex-col md:flex-row gap-10 items-center mb-10">
                  <div className="relative shrink-0">
                    <div className="w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-200 border-8 border-white shadow-2xl">
                      <div className="text-center">
                        <motion.span 
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="block text-4xl font-black text-amber-900"
                        >
                          {result.overall_luck_percentage}%
                        </motion.span>
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">ကံအင်အား</span>
                      </div>
                    </div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 border-2 border-dashed border-amber-300/50 rounded-full pointer-events-none"
                    />
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      ယနေ့ {result.day} သားသမီးများအတွက်
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xl font-light">
                      {result.general_prediction}
                    </p>
                  </div>
                </div>

                {/* Lucky Elements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-100">
                  <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100/50">
                    <span className="text-xs font-black text-amber-800/60 uppercase tracking-widest block mb-4">🎨 ကံကောင်းစေသော အရောင်များ</span>
                    <div className="flex flex-wrap gap-2">
                      {result.lucky_colors.map((c, i) => (
                        <span key={i} className="bg-white px-4 py-2 rounded-2xl text-sm font-bold shadow-sm border border-amber-100 text-amber-900">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                    <span className="text-xs font-black text-blue-800/60 uppercase tracking-widest block mb-4">🔢 ကံကောင်းစေသော ဂဏန်းများ</span>
                    <div className="flex flex-wrap gap-2">
                      {result.lucky_numbers.map((n, i) => (
                        <span key={i} className="bg-white px-4 py-2 rounded-2xl text-lg font-black shadow-sm border border-blue-100 text-blue-700">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100/50">
                    <span className="text-xs font-black text-red-800/60 uppercase tracking-widest block mb-4">⛔ ရှောင်ကြဉ်ရမည့် အရပ်မျက်နှာ</span>
                    <div className="flex flex-wrap gap-2">
                      {result.avoid_directions.map((d, i) => (
                        <span key={i} className="bg-white px-4 py-2 rounded-2xl text-sm font-bold shadow-sm border border-red-100 text-red-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Business */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-50/50"
                >
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Briefcase size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">စီးပွားရေး နှင့် ငွေကြေး</h4>
                  <p className="text-gray-600 leading-relaxed text-base font-light">{result.business_and_finance}</p>
                </motion.div>

                {/* Love */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-50/50"
                >
                  <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Heart size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">အချစ်ရေး နှင့် လူမှုရေး</h4>
                  <p className="text-gray-600 leading-relaxed text-base font-light">{result.love_and_relationship}</p>
                </motion.div>

                {/* Health */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-green-50/50"
                >
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Activity size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">ကျန်းမာရေး</h4>
                  <p className="text-gray-600 leading-relaxed text-base font-light">{result.health}</p>
                </motion.div>

              </div>

              {/* Yadayar (Remedy) */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-[#2a1b38] to-[#1a0b28] p-8 md:p-12 rounded-[3rem] shadow-2xl border border-amber-500/20 text-amber-50"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-20 h-20 bg-amber-500 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-2xl rotate-3">
                    <ShieldCheck size={40} />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl font-bold text-amber-400 mb-4 flex items-center justify-center md:justify-start gap-2">
                      <Sparkles size={24} className="text-amber-300" />
                      ယနေ့အတွက် ယတြာနှင့် ကုသိုလ်
                    </h4>
                    <p className="text-amber-100/90 leading-relaxed text-xl font-medium italic">
                      "{result.yadayar_remedy}"
                    </p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#2a1b38] text-amber-100/40 py-16 px-4 mt-20 text-center border-t border-amber-500/10">
        <div className="flex justify-center gap-8 mb-8">
          <Moon size={24} className="hover:text-amber-400 transition-colors cursor-pointer" />
          <Star size={24} className="hover:text-amber-400 transition-colors cursor-pointer" />
          <Sun size={24} className="hover:text-amber-400 transition-colors cursor-pointer" />
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-base leading-relaxed">
            ဤဟောစာတမ်းသည် နေ့စဉ် နက္ခတ်ခွင်နှင့် ဂြိုဟ်သွားဂြိုဟ်လာများအပေါ် မူတည်၍ ယေဘုယျ တွက်ချက်ထားခြင်းဖြစ်ပါသည်။<br/>
            စိတ်ချမ်းသာ ကိုယ်ကျန်းမာစွာဖြင့် နေ့ရက်တိုင်းကို ဖြတ်သန်းနိုင်ပါစေ။
          </p>
          <div className="pt-8 flex flex-col items-center gap-2">
            <p className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">
              Powered by Gemini AI • Myanmar Astrology
            </p>
            <div className="h-px w-12 bg-amber-500/20" />
          </div>
        </div>
      </footer>
    </div>
  );
}
