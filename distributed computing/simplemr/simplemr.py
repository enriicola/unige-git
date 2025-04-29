from functools import partial
from itertools import groupby, islice
from operator import itemgetter

# from the more_itertools package (https://more-itertools.readthedocs.io/)
def take(n, iterable):
    """Return first *n* items of the iterable as a list.

        >>> take(3, range(10))
        [0, 1, 2]

    If there are fewer than *n* items in the iterable, all of them are
    returned.

        >>> take(10, range(3))
        [0, 1, 2]

    """
    return list(islice(iterable, n))

# from the more_itertools package (https://more-itertools.readthedocs.io/)
def chunked(iterable, n):
    """Break *iterable* into lists of length *n*:

        >>> list(chunked([1, 2, 3, 4, 5, 6], 3))
        [[1, 2, 3], [4, 5, 6]]

    If the length of *iterable* is not evenly divisible by *n*, the last
    returned list will be shorter:

        >>> list(chunked([1, 2, 3, 4, 5, 6, 7, 8], 3))
        [[1, 2, 3], [4, 5, 6], [7, 8]]

    To use a fill-in value instead, see the :func:`grouper` recipe.

    :func:`chunked` is useful for splitting up a computation on a large number
    of keys into batches, to be pickled and sent off to worker processes. One
    example is operations on rows in MySQL, which does not implement
    server-side cursors properly and would otherwise load the entire dataset
    into RAM on the client.

    """
    return iter(partial(take, n, iter(iterable)), [])

first = itemgetter(0)   # returns 1st element in a tuple
second = itemgetter(1)  # returns the 2nd element in a tuple

class MapReduce():
    def map(self, v):
        raise NotImplementedError
    
    def reduce(self, k, values):
        raise NotImplementedError
    
    def apply_map(self, data):
        for elem in data:
            yield from self.map(elem)
    
    def sort_and_group(self, kvpairs):
        kvpairs = sorted(kvpairs, key=first)
        for k, g in groupby(kvpairs, key=first):
            yield k, map(second, g)  # note: not self.map, built-in function map
    
    def apply_reduce(self, groups):
        for k, values in groups:
            yield from self.reduce(k, values)

    def run(self, data):
        kvpairs = self.apply_map(data)
        groups = self.sort_and_group(kvpairs)
        return self.apply_reduce(groups)

    
class MapReduceCombine(MapReduce):
    def combine(self, k, values):
        raise NotImplementedError
        
    def apply_combine(self, kvpairs, combine_size):
        for kvchunk in chunked(kvpairs, combine_size):
            for k, values in self.sort_and_group(kvchunk):
                yield from self.combine(k, values)
    
    def run(self, data, combine_size=1024):
        kvpairs = self.apply_map(data)
        kvpairs = self.apply_combine(kvpairs, combine_size)
        groups = self.sort_and_group(kvpairs)
        return self.apply_reduce(groups)
