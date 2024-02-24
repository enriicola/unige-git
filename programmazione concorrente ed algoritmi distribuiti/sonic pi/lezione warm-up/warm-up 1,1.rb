# Welcome to Sonic Pi

#for i in 0..2

in_thread do
  live_loop :my_loop do
    sync :pippo
    sample :loop_amen
    sleep 0.877
    sample :loop_amen
  end
end

sleep 0.3

in_thread do
  loop do
    cue :pippo
    if one_in(5)
      sample :drum_heavy_kick
    else
      sample :drum_cymbal_closed
    end
    sleep 0.877
  end
end