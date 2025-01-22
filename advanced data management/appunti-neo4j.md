CREATE (p1:Person {id:1, name: "Lorenzo Foschi"})
CREATE (h1:Hobby {id:5, name: "Computer Science"})
CREATE (h2:Hobby {id:6, name: "Girls"})
CREATE (h3:Hobby {id:7, name: "Books"})
MERGE (p1)-[:LIKES]->(h1)
MERGE (p1)-[:LIKES]->(h2)
MERGE (p1)-[:LIKES]->(h3)
return p1

CREATE (p1:Person {name: "Lorenzo Foschi"})
WITH p1
UNWIND ["Computer Science", "Girls", "Books"] AS hobbyName
MERGE (h:Hobby {name: hobbyName})
MERGE (p1)-[:LIKES]->(h)
RETURN p1




-- Find 10 actor names
MATCH (p: Person) LIMIT 10 RETURN p

-- Find how many movies have been released after 2005
MATCH (m:Movie)
WHERE m.released > 2005
RETURN COUNT(m) AS movies_after_2005

-- Create a WATCHED relationship between yourself and Cloud Atlas. Show it.
MATCH (me:Person {name: "Your Name"})
MATCH (movie:Movie {title: "Cloud Atlas"})
MERGE (me)-[:WATCHED]->(movie)
RETURN me, movie

-- FInd who directed V for Vendetta
MATCH (director:Person)-[:DIRECTED]->(movie:Movie {title: "V for Vendetta"})
RETURN director.name AS Director

-- Find people who have acted in movies released after 2005

-- Find all people who have co-acted with Kevin Bacon (in any movie)

-- Find people 3 steps away from Tom Hawks

-- Find (and show) the shortest path between Pill Paxton and Garry Sinise