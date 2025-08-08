import gsapBase from 'gsap';
import { ScrollTrigger as ScrollTriggerPlugin } from 'gsap/ScrollTrigger';

// Register plugins only in the browser
if (typeof window !== 'undefined' && (gsapBase as any).registered !== true) {
  gsapBase.registerPlugin(ScrollTriggerPlugin);
  (gsapBase as any).registered = true;
}

export const gsap = gsapBase;
export const ScrollTrigger = ScrollTriggerPlugin;

export const withGsapContext = (
  setup: (self: gsap.core.Context) => void,
  scope: Element | null,
) => {
  if (typeof window === 'undefined') return;
  const ctx = gsap.context(() => setup(ctx), scope || undefined);
  return () => ctx.revert();
};

export default gsapBase;

