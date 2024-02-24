set :a, (ring 6, 5, 4, 3, 2, 1)
live_loop :shuffled do
  set :a, get[:a].shuffled
  a = a.shuffle
  sleep 0.5
end

live_loop :sorted do
  set :a, get[:a].sort
  a = a.sort
  sleep 0.5
  puts "sorted: ", get[:a]
end