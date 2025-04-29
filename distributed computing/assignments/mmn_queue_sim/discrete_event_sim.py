# library file
import logging
import heapq

# suggestion: have a look at the heapq library (https://docs.python.org/dev/library/heapq.html) and in particular heappush and heappop

class Simulation:
    """Subclass this to represent the simulation state.

    Here, self.t is the simulated time and self.events is the event queue.
    """

    def __init__(self):
        """Extend this method with the needed initialization.

        You can call super().__init__() there to call the code here.
        """
        super().__init__()
        self.timestamp = 0  # simulated time
        self.events: list[tuple[float, "Event"]] = []

    def schedule(self, delay, event):
        """Add an event to the event queue after the required delay."""

        # Add event with scheduled time (self.t + delay) as the priority
        heapq.heappush(self.events, (self.timestamp + delay, event))

    def run(self, max_t=float('inf')):
        """Run the simulation. If max_t is specified, stop it at that time."""

        # as long as the event queue is not empty:
        while self.events:
            # get the first event from the queue (earliest scheduled time)
            t, event = item = heapq.heappop(self.events)
            if t > max_t:
                break
            self.timestamp = t
            event.process(self)

    def log_info(self, msg):
        logging.info(f'{self.timestamp:.2f}: {msg}')


class Event:
    """
    Subclass this to represent your events.

    You may need to define __init__ to set up all the necessary information.

    def __init__(self, event_time):
        self.event_time = event_time
    """

    # def __init__(self, job_id, interval=1):
    #     self.id = job_id
    #     self.interval = interval # Time between repeating events (optional)

    def process(self, sim: Simulation):
        raise NotImplementedError

    def __lt__(self, other):
        """Method needed to break ties with events happening at the same time."""


        return id(self) < id(other) # Use scheduled time for comparison