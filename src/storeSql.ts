import mysql, { Pool } from 'mysql2/promise';

export class MySQL {

    public host : string;
    public user : string;
    private password : string;
    public database : string;
    public datatable : string;
    private pool: Pool;

    constructor(
        host : string,
        user : string,
        password : string,
        database : string,
        datatable : string
    ) {
        this.host = host;
        this.user = user;
        this.database = database;
        this.datatable = datatable;
        this.pool = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: database
        });
    }

    /**
     * @method
     * @name insertPriceData
     * @description Inserts an array of price data into a database.
     * @param {object[]} dataArray - An array of objects containing price data to be inserted into database.
    */
    async insertPriceData(dataArray) {
        const connection = await this.pool.getConnection();
    
        try {

            await connection.beginTransaction();

            await this.create_table(connection)
    
            // prepare an array of promises for Promise.all()
            const promises = dataArray.map(data => {
                const { symbol, price, fetchFrom, timestamp } = data;
    
                const sql = `INSERT INTO ${this.datatable} (symbol, price, fetchFrom, timestamp) VALUES (?, ?, ?, ?)`;
    
                return connection.execute(sql,[symbol, price, fetchFrom ,timestamp]);
            });
    
            await Promise.all(promises);
            console.log("datas are stored successfully");
    
            // commit transaction if everything is ok
            await connection.commit();
        
        } catch(err) {
          console.error('Error inserting data', err);
       
          // rollback changes in case of any error 
          if (connection) {
              await connection.rollback();
         }
      
        } finally {
    
          // close the connection whether it was successful or not 
          if (connection) {
              await connection.release();
          }
    
        }
    }

    private async create_table(connection) : Promise<void> {
        // Run script
        try {

            await connection.execute(`
    
                CREATE TABLE IF NOT EXISTS ${this.datatable} (
                    symbol VARCHAR(255) NOT NULL,
                    price DECIMAL(19, 4) NOT NULL,
                    fetchFrom VARCHAR(255) NOT NULL,
                    timestamp BIGINT UNSIGNED NOT NULL
                );
            `);
            
        } catch (error) {
            console.error("Error creating table", error);
            
        }
    }
}