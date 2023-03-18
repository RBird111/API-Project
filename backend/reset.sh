rm db/dev.db

npx dotenv sequelize db:migrate

npx dotenv sequelize db:seed:all

sqlite3 db/dev.db ".read sql-data.sql"
