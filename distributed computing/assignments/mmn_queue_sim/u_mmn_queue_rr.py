# https://2023.aulaweb.unige.it/mod/page/view.php?id=89833 # guidelines :D
#!/usr/bin/env python3

import matplotlib.pyplot as plt
import argparse
from random import expovariate
import csv
import collections
import logging
from random import sample, seed
from workloads import weibull_generator
from discrete_event_sim import Simulation, Event

# Event to get lengths, to obtain statistics to use in plots.
class Lengths(Event):
    def __init__(self, queue_length_frequency):
        self.queue_length_frequency = queue_length_frequency

    def process(self, sim: "MMN"):
        sim.q_lengths = [sim.queue_len(i) for i in range(sim.n)]
        sim.w_track.append((sum(sim.q_lengths) / len(sim.q_lengths)) / sim.lambd)

        for length in sim.q_lengths:
            while len(sim.queue_count) <= length:
                sim.queue_count.append(0)  # Add zero counts for new lengths.
            sim.queue_count[length] += 1  # Count how many queues have the same length at that moment.

        sim.schedule(self.queue_length_frequency, self)

class MMN(Simulation):
    def __init__(self, e, lambd, mu, n, d, shape, queue_length_frequency, w_track, queue_count):
        if n < d:
            raise ValueError('d must be less than n')
            
        super().__init__()

        self.extension = e

        # Queues and running jobs.
        self.running = [None] * n  # If not None, the ID of the running job.
        self.queues = [collections.deque() for _ in range(n)]
        self.arrivals = {}  # Dictionary mapping job ID to arrival time.
        self.completions = {}  # Dictionary mapping job ID to completion time.
        
        # Statistics for the queue lengths.
        self.q_lengths = [0 for _ in range(n)]
        self.queue_length_frequency = queue_length_frequency
        self.queue_count = queue_count
        self.w_track = w_track

        # Basic statistics.
        self.lambd = lambd
        self.n = n
        self.d = d
        self.mu = mu
        self.arrival_rate = lambd * n
        self.x = mu
        self.completion_rate = mu

        # Initialize the Weibull generators for the arrival and completion times.
        self.shape = shape
        self.arrival_gen = weibull_generator(self.shape, 1 / self.arrival_rate)
        self.completion_gen = weibull_generator(self.shape, 1 / self.completion_rate)

        # Schedule the first arrival and the first GetLengths event.
        self.schedule(0, Arrival(0, self.supermarket()))
        self.schedule(0, Lengths(queue_length_frequency))

    def supermarket(self) -> int:
        # Choose d random queues by their indexes.
        indexes = sample(range(len(self.queues)), self.d)
        # Return the index of the queue with the minimum length.
        return min(indexes, key=lambda i: self.queue_len(i))

    def fifo_schedule(self) -> int:
        return 0

    def my_round_robin(self, job_id) -> int:
        # Choose the next queue in the round robin fashion.
        return job_id % self.n

    def is_critical(self, job_id) -> bool:
        # return job_id % 2 == 0
        return True

    def schedule_arrival(self, job_id):
        # Schedule the arrival of the next job ... following a weibull or exponential distribution (if shape = 1 -> exponential distribution)
        if not self.extension:
            self.schedule(self.arrival_gen(), Arrival(job_id, self.supermarket()))
        else:
            if self.is_critical(job_id):
                server_id = self.my_round_robin(job_id)
            else:
                server_id = self.fifo_schedule(job_id)
            self.schedule(self.arrival_gen(), Arrival(job_id, server_id))
            

    def schedule_completion(self, job_id, server_id):
        # Schedule the completion of the job ... following a weibull or exponential distribution (if shape = 1 -> exponential distribution)
        self.schedule(self.completion_gen(), Completion(job_id, server_id))

    def queue_len(self, queue_id):
        return (self.running[queue_id] is not None) + len(self.queues[queue_id])

class Arrival(Event):
    def __init__(self, job_id, server_id):
        self.id = job_id
        self.server_id = server_id

    def process(self, sim: MMN):
        # Set the arrival time of the job.
        sim.arrivals[self.id] = sim.timestamp

        # If there is no running job, assign the incoming one and schedule its completion.
        if sim.running is not None and sim.running[self.server_id] is None:
            sim.running[self.server_id] = self.id
            sim.schedule_completion(self.id, self.server_id)
        else:
            # Otherwise put the job into the queue.
            sim.queues[self.server_id].append(self.id)

        # Schedule the arrival of the next job.
        sim.schedule_arrival(self.id + 1)

class Completion(Event):
    def __init__(self, job_id, server_id):
        self.id = job_id
        self.server_id = server_id

    def process(self, sim: MMN):
        assert sim.running[self.server_id] is not None

        # Set the completion time of the running job.
        sim.completions[sim.running[self.server_id]] = sim.timestamp
        
        # If the queue is not empty.
        if len(sim.queues[self.server_id]) > 0:
            # Get a job from the queue.
            next_job = sim.running[self.server_id] = sim.queues[self.server_id].popleft()
            # Schedule its completion.
            sim.schedule_completion(next_job, self.server_id)
        else:
            sim.running[self.server_id] = None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--lambd', type=float, default=0.0)
    parser.add_argument('--mu', type=float, default=1)
    parser.add_argument('--max-t', type=float, default=10000)
    parser.add_argument('--n', type=int, default=1)
    parser.add_argument('--d', type=int, default=1)
    parser.add_argument('-t', action='store_true', help="Plot the theoretical values")
    parser.add_argument('--csv', help="CSV file in which to store results")
    parser.add_argument("--seed", help="Random seed")
    parser.add_argument("-v", action='store_true', help="Verbose")
    parser.add_argument("-e", action='store_true', help="Extension for the round robin scheduling")
    parser.add_argument("--queue_length_frequency", type=int, default=100)

    # for the Weibull distribution
    parser.add_argument('--shape', type=float, default=1) # if shape = 1 -> exponential distribution
    
    args = parser.parse_args()

    if args.seed:
        seed(args.seed)  # Set a seed to make experiments repeatable.
    if args.v:
        logging.basicConfig(format='{levelname}:{message}', level=logging.INFO, style='{')  # Output info on stdout.

    # Modify this line to specify multiple lambda values.
    if args.lambd != 0.0:
        lambdas = [args.lambd]
    else:
        lambdas = [0.5, 0.9, 0.95, 0.99]

    pre_allocated = 10  # Other queue lengths are eventually added on the fly.
    w_track = []  # Initialize an empty list to store all lengths for Wt computation.

    # Creating CSV file.
    if args.csv is not None:
        with open(args.csv, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Lambda', 'Mu', 'Max time of simulation', 'Average time spent', 'Theoretical avg time spent', 'N of queues', 'D choice'])
 
    color_map = {
        0.5: 'red',
        0.9: 'blue',
        0.95: 'green',
        0.99: 'purple'
    }

    for lambd in lambdas:
        sim = MMN(args.e, lambd, args.mu, args.n, args.d, args.shape, args.queue_length_frequency, w_track, queue_count=[0] * pre_allocated)
        sim.run(args.max_t)

        completions = sim.completions

        # Practical W: Average time spent in queue by a job.
        W = (sum(completions.values()) - sum(sim.arrivals[job_id] for job_id in completions)) / len(completions)
        print(f"\nAverage time spent in the system for λ={lambd}: {W}")

        # Theoretical W L / lambda for Little's law.
        Wt = (sum(sim.q_lengths) / len(sim.q_lengths)) / lambd
        print(f"Theoretical expectation for random server choice: {Wt}")

        # Compute Wt based on all the queue lengths stored in the list.
        Wt = sum(w_track) / len(w_track)
        print(f"Theoretical expectation for random server choice using avg in list: {Wt}")

        q_lengths = list(range(len(sim.queue_count)))

        sum_tot = sum(sim.queue_count)  # Sum of all the queue counts.
        fractions = []  # Auxiliary list of fractions.

        # Calculate the sum of all the queues with length >= i and dividing by the sum of all the queues.
        for i in range(len(sim.queue_count)):
            acc = sum_tot  # Reset the value to the sum of all the queues.
            while i - 1 > -1:  # Proceed removing backwards all the queues with length smaller than i.
                acc -= sim.queue_count[i - 1]  # Subtract from the total the number of queues with that length.
                i -= 1
            acc /= sum_tot
            fractions.append(acc)

        # Plot the graph for theoretical values, if argument t is passed.
        if args.t:
            queue_range = pre_allocated * 2
            if sim.d == 1:
                plt.plot([i for i in range(1, queue_range)], [lambd ** i for i in range(1, queue_range)], linestyle='dotted', color=color_map[lambd], label=f'Theoretical with λ={lambd}')
            else:
                plt.plot([i for i in range(1, queue_range)], [lambd ** (((sim.d ** i) - 1) / (sim.d - 1)) for i in range(1, queue_range)], linestyle='dotted', label=f'Theoretical with λ={lambd}', color=color_map[lambd])
        
        # Plot the graph for real values. #(moved here to have the theoretical line on top, compliant with the plot figure)
        plt.plot(q_lengths, fractions, label=f'Empirical with λ={lambd}', color=color_map[lambd])
 
        # Write results to the specified CSV file.
        if args.csv is not None:
            with open(args.csv, 'a', newline='') as f:
                writer = csv.writer(f)
                writer.writerow([lambd, args.mu, args.max_t, W, Wt, args.n, args.d])

    # Set labels, title, grid and legend.
    plt.xlabel('Queue length (i jobs in the queue)')
    plt.ylabel('Fraction of queues of at least size i')
    plt.title(f"Choices=d={sim.d}")
    plt.grid(True)
    plt.legend()
    plt.ylim(0.0, 1.0)
    plt.xlim(1, 14)
    print("Saving the plot ...")
    plt.savefig('mmn.png')

if __name__ == '__main__':
    main()
