live_loop :b do
  sync :c
  play :e4, release: 0.5
  sleep 0.5
end

live_loop :c do
  sample :bd_haus
  sleep 1
end