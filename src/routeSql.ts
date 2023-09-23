import mysql, { Pool } from 'mysql2/promise';

export class MySQL {

    private host : string;
    private user : string;
    private password : string;
    private database : string;
    public datatable : string;
    private pool: Pool;

    constructor(
        host : string,
        user : string,
        password : string,
        database : string,
        datatable : string
    ) {
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

    /**
     *
     *@method
     *@name getTokenInfo 
     *@description  This function will either call one out of three functions based on provided parameters:
                    If only 'tokenName' is provided then it will call 'getLatestTokenInfo' method.
                    If 'tokenName' and 'source' are provided then it will call 'getLatestTokenInfoFromSource' method.
                    If 'tokenName', 'startTime', and 'endTime' are provided then it will call 'getAveragePriceInTimeframe' method.
     *@param {string} tokenSymbol - The name/symbol of the cryptocurrency whose information is to be fetched. This parameter is required.
     *@param {string} source - The source of the price data. This parameter is optional. 
     *@param {number} startTime - Start time in UNIX timestamp format to define start of time period for average price calculation. This parameter is optional. 
     *@param {number} endTime - End time in UNIX timestamp format to define end of time period for average price calculation. This parameter is optional.  
    */
    public async getTokenInfo(tokenSymbol: string, source?: string, startTime?: number, endTime?: number){
        
        // If source is provided and startTime and endTime are not provided
        // then fetch latest token info from specific source.
        if (source && !startTime && !endTime) {
            return this.getLatestTokenInfoFromSource(tokenSymbol ,source);
        
        // If only tokenName is provided then fetch latest token info from all sources.
        } else if (!source && !startTime && !endTime) {
            return this.getLatestTokenInfo(tokenSymbol);
        
        // If source and startTime and endTime are provided then get average price over certain time period from specific source.
        } else if (source && startTime && endTime) {         
            return this.getAveragePriceInTimeframeFromSource(startTime,endTime ,tokenSymbol, source);

        // If startTime and endTime are provided then get average price over certain time period from each source.
        } else if (!source && startTime && endTime) {         
            return this.getAveragePriceInTimeframe(startTime,endTime ,tokenSymbol);
           
        } else if (!startTime && !endTime) {         
            throw new Error('check startTime or endTime. it should be together');

        } else {       
            throw new Error('Invalid parameter combination');
        }
    }

    /**
     * @method
     * @name getLatestTokenInfo
     * @description Fetches the latest information for a specific token from each source.
     * @param {string} tokenSymbol - The name of the token.
    */
    private async getLatestTokenInfo(tokenSymbol: string) {
        const connection = await this.pool.getConnection();
        try {
            const sql = `
                WITH ranked_prices AS (
                    SELECT 
                    symbol,
                    fetchFrom,
                    price,
                    timestamp,
                    ROW_NUMBER() OVER (PARTITION BY fetchFrom ORDER BY timestamp DESC) as rn
                    FROM ${this.datatable}
                    WHERE symbol = ?
                )`;

            const [rows] = await connection.query(sql,[tokenSymbol]);
            return rows;
        } finally {
            if (connection) await connection.release();
        }
    }

    /**
     * @method
     * @name getLatestTokenInfoFromSource
     * @description Fetches the latest information for a specific token from a specific source.
     * @param {string} tokenSymbol - The name of the token.
     * @param {string} source - The source of the price data.
    */
    private async getLatestTokenInfoFromSource(tokenSymbol: string, source: string) {
        const connection = await this.pool.getConnection();
        try {
            const sql = `
                SELECT * 
                FROM ${this.datatable}
                WHERE symbol = ? AND fetchFrom= ?
                ORDER BY timestamp DESC LIMIT 1`;
            const [rows] = await connection.query(sql, [tokenSymbol, source]);
            return rows;
        } finally {
            if (connection) await connection.release();
        }
    }

    /**
     *@method
     *@name getAveragePriceInTimeframe
     *@description Gets average price of a specific token over certain time period from each available sources in database. 
     *@param {number} startTime - Start time in UNIX timestamp format to define start of time period. 
     *@param {number} endTime - End time in UNIX timestamp format to define end of time period.  
     *@param {string} tokenSymbol - The name/symbol of the cryptocurrency whose average price is to be calculated.   
    */
    private async getAveragePriceInTimeframe(startTime: number, endTime: number, tokenSymbol:string){
        const connection=await this.pool.getConnection();

        try{
            let sql=`
                    SELECT symbol, fetchFrom, AVG(price) as average_price, ROUND(AVG(timestamp)) as average_timestamp
                    FROM ${this.datatable}
                    WHERE timestamp BETWEEN ? AND ? AND symbol=?
                    GROUP BY fetchFrom`;
            let params=[startTime,endTime,tokenSymbol];
            let [rows]=await connection.query(sql,params);
            return rows;

        }finally{
            if(connection)
                await connection.release();
        }
    }

    /**
     *@method
     *@name getAveragePriceInTimeframeFromSource
     *@description Gets average price of a specific token over certain time period from the specified source in database. 
     *@param {number} startTime - Start time in UNIX timestamp format to define start of time period. 
     *@param {number} endTime - End time in UNIX timestamp format to define end of time period.  
     *@param {string} tokenSymbol - The name/symbol of the cryptocurrency whose average price is to be calculated.
     *@param {string} source - The source of the price data.
    */
    private async getAveragePriceInTimeframeFromSource(startTime: number, endTime: number, tokenSymbol:string, source: string){
        const connection=await this.pool.getConnection();

        try{
            let sql=`SELECT symbol, fetchFrom, AVG(price) as average_price, ROUND(AVG(timestamp)) as average_timestamp
                    FROM ${this.datatable}
                    WHERE timestamp BETWEEN ? AND ? AND symbol=? AND fetchFrom=?`;
            let params=[startTime,endTime,tokenSymbol,source];
            let [rows]=await connection.query(sql,params);
            return rows;

        }finally{
            if(connection)
                await connection.release();
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