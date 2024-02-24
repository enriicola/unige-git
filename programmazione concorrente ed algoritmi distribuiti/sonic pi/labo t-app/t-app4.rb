live_loop :drumsplate do
  sample :drum_cymbal_hard
  sleep 0.5
end

live_loop :drumskick do
  sleep 1
  sample :drum_heavy_kick
  sleep 2
  sample :drum_heavy_kick
  sleep 0.5
end

live_loop :drumssnare do
  sample :drum_snare_hard
  sleep 1.25
  sample :drum_snare_hard
  sleep 0.75
  sample :drum_snare_hard
  sleep 0.75
  sample :drum_snare_hard
  sleep 1.25
end