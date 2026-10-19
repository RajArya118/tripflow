import React, { useState } from 'react';
import { ArrowUpRight, ShieldCheck, HeartHandshake, Compass, Sparkles, Check } from 'lucide-react';

export const EditorialSection: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const stories = [
    {
      index: '01',
      title: 'The Art of Slow Living in the Kyoto Bamboo Groves',
      subtitle: 'Why spending four days inside a centuries-old wooden machiya recalibrates the senses.',
      readTime: '6 min read',
      author: 'Aiko Mori',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    },
    {
      index: '02',
      title: 'Navigating the Silent Grottos of the Tyrrhenian Coast',
      subtitle: 'Beyond the crowded shores of Positano: the hidden anchorages and sea caves of Amalfi.',
      readTime: '8 min read',
      author: 'Matteo Rossi',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    },
    {
      index: '03',
      title: 'A Night under the Arctic Aurora in Geothermal Stillness',
      subtitle: 'What happens when silence, glacial winds, and the Northern Lights converge.',
      readTime: '5 min read',
      author: 'Gudrun Sigurd',
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  return (
    <section id="journal" className="py-20 px-6 max-w-6xl mx-auto space-y-20">
      {/* Editorial Stories Section */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
              The AuraVoyage Journal
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-stone-900">
              Essays in Discerning Travel
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-sm">
            Dispatches from our regional correspondents, architects, and culinary curators around the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <article
              key={story.index}
              className="group cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-stone-100 relative">
                <img
                  src={story.image}
                  alt={story.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono mb-1">
                    <span>{story.index}</span>
                    <span aria-hidden="true">·</span>
                    <span>{story.readTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>By {story.author}</span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-2">
                    {story.subtitle}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-900 group-hover:translate-x-1 transition-transform">
                  <span>Read Essay</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Trust & Craftsmanship Pillars */}
      <div className="border-t border-stone-200 pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2.5">
          <ShieldCheck className="w-6 h-6 text-amber-900" />
          <h4 className="font-serif text-base font-bold text-stone-900">100% In-Person Vetted</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every villa, ryokan, and safari camp in our collection has been physically evaluated by our architectural and hospitality curators.
          </p>
        </div>

        <div className="space-y-2.5">
          <Compass className="w-6 h-6 text-amber-900" />
          <h4 className="font-serif text-base font-bold text-stone-900">Private Regional Concierge</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            From after-hours temple access in Kyoto to tender yacht transfers in Positano, a designated host attends to every logistical request.
          </p>
        </div>

        <div className="space-y-2.5">
          <HeartHandshake className="w-6 h-6 text-amber-900" />
          <h4 className="font-serif text-base font-bold text-stone-900">Carbon Conscious Sanctuaries</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            We prioritize solar-powered wilderness camps, historic restoration projects, and zero-single-use-plastic heritage estates.
          </p>
        </div>
      </div>

      {/* Newsletter / Bespoke Travel Guide Dispatch */}
      <div className="p-8 sm:p-10 bg-stone-900 rounded-2xl text-stone-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
            The Bi-Weekly Monograph
          </div>
          <h3 className="font-serif text-2xl font-bold text-white mb-2">
            Receive unlisted private estates & seasonal openings.
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Curated travel monographs sent every alternate Thursday. No spam, ever.
          </p>
        </div>

        <div className="w-full md:w-auto min-w-[320px]">
          {subscribed ? (
            <div className="p-4 bg-stone-800 border border-amber-400/40 rounded-xl text-center text-xs text-amber-300 font-medium flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Thank you! The autumn monograph is on its way.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 flex-1"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
