V1 -> V2
```bash
docker cp ./backend/data/migrate.js stack_mongo_1:/migrate.js
docker cp ./backend/data/migrate_2.js stack_mongo_1:/migrate_2.js
docker cp ./backend/data/migrate_3.js stack_mongo_1:/migrate_3.js
docker cp ./backend/data/migrate_4_testimonials.js stack_mongo_1:/migrate_4_testimonials.js
docker cp ./backend/data/migrate_5_persons.js stack_mongo_1:/migrate_5_persons.js
docker cp ./backend/data/migrate_6_dois.js stack_mongo_1:/migrate_6_dois.js
docker cp ./backend/data/migrate_7_repurls.js stack_mongo_1:/migrate_7_repurls.js

docker-compose -f docker-compose-local.yml exec mongo mongo localhost:27017/rsd /migrate.js
docker-compose -f docker-compose-local.yml exec mongo mongo localhost:27017/rsd /migrate_2.js
docker-compose -f docker-compose-local.yml exec mongo mongo localhost:27017/rsd /migrate_3.js
docker-compose -f docker-compose-local.yml exec mongo mongo localhost:27017/rsd /migrate_4_testimonials.js
docker-compose -f docker-compose-local.yml exec mongo mongo localhost:27017/rsd /migrate_5_persons.js
docker-compose -f docker-compose-local.yml exec mongo mongo localhost:27017/rsd /migrate_6_dois.js
docker-compose -f docker-compose-local.yml exec mongo mongo localhost:27017/rsd /migrate_7_repurls.js
```