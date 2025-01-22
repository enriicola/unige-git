- Product (q1, q2)
   - cassandra: //regola=garantisce che il vincolo di unicità possa essere verificato localmente
      - partition key = ProductQ1 -> primary key (IdProd)
                        ProductQ2 -> primary key (ProdName, IdProd)
      - identifier = IdProd
      - traduzione meta-schema nello schermo del sistema ()
   - mongo: //non si possono creare indici
            //ogni shard-key deve essere indicizzata
            //gli indici possono essere UNIQUE o NON UNIQUE
            //ogni indice UNIQUE deve essere creato su un insieme di attributi con shard-key come prefisso
      - partition key = ProductQ1 -> primary key (IdProd)
                        ProductQ2 -> primary key (ProdName, IdProd)
      - identifier = IdProd
      - traduzione meta-schema nello schermo del sistema ()

- Category (q3, q8)
   - partition key = categoryId
   - identifier = IdCat
   - traduzione meta-schema nello schermo del sistema ()


- Order (q4, q5, q6, q7)
   - partition key = orderId
   - identifier = IdO
   - traduzione meta-schema nello schermo del sistema ()



   
   
codice per mongo: //con indici
   db.createCollection("Product", { json schema },

   db.Product.createindex({"IdProd": 1}, {unique: true})

   db.adminCommand(shardCollection:"Product",
                   key: "IdProd")




codice per cassandra: //con indici
CREATE TABLE Product 
   (IdProd INT PRIMARY KEY,
   ProdName text,
   Description text,
   Price DECIMAL(52),
   SName text
   )

CATEGORIES 
   set<int>

CREATE INDEX
   ON Product (
      ProdName
   )

#############################
appunti lollo:
-- aggr. design su Ass1:

1Cassandra) PK(IdO) = PartK
1Mongo) ShardKeyUnique(IdO)

2C) PK(IdU, DataOra) , PartK(IdU)
2M) SK(IdU, DataOra)

3C) se senza ixd: tre tabelle (una con i due IdProd, una con Desc e l'altra con PrezzoBase) / con idx: PartK(IdProd) + idx su Desc + idx su PrezzoBase
3M) stesse scelte di C