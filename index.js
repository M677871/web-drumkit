
(() => {
  
  const SOUND_MAP = {
    w: 'sounds/tom-1.mp3',
    a: 'sounds/tom-2.mp3',
    s: 'sounds/tom-3.mp3',
    d: 'sounds/tom-4.mp3',
    j: 'sounds/snare.mp3',
    k: 'sounds/crash.mp3',
    l: 'sounds/kick-bass.mp3'
  };

  
  const audioCache = new Map();

  const preloadAudio = async () => {
    const entries = Object.entries(SOUND_MAP);
    await Promise.all(entries.map(async ([key, src]) => {
      const audio = new Audio(src);
      await new Promise((res, rej) => {
        audio.addEventListener('canplaythrough', res, { once: true });
        audio.addEventListener('error', () => rej(src), { once: true });
      });
      audioCache.set(key, audio);
    }));
  };

  const playSound = (key) => {
    const audio = audioCache.get(key);
    if (!audio) {
      console.warn(`No sound mapped for key: "${key}"`);
      return;
    }
    audio.currentTime = 0;
    audio.play().catch(err => console.error('Playback error:', err));
  };

 
  const animateButton = (key) => {
    const btn = document.querySelector(`.drum[data-key="${key}"]`);
    if (!btn) return;
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 100);
  };

  


  const trigger = (key) => {
    key = key.toLowerCase();
    if (!SOUND_MAP[key]) return;
    playSound(key);
    animateButton(key);
  };

  
  const onClick = (e) => {
    const btn = e.target.closest('.drum');
    if (!btn) return;
    trigger(btn.dataset.key);
  };

 
  const onKeydown = (e) => {
    trigger(e.key);
  };

  
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await preloadAudio();
    } catch (src) {
      console.error('Failed to load:', src);
    }
    document.body.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
  });
})();
