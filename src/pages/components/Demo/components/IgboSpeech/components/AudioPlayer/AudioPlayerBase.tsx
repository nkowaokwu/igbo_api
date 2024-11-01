import React, { forwardRef } from 'react';

const AudioPlayerBase = forwardRef<HTMLAudioElement, { url: string }>(({ url }, ref) => (
  <audio aria-disabled={!url} ref={ref} src={url || undefined} controls style={{ width: '100%' }}>
    <source src={url || undefined} type="audio/mp3" />
    <track kind="captions" />
  </audio>
));

export default AudioPlayerBase;
