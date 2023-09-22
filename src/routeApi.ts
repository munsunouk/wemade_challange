import express from 'express';
import { MySQL } from './routeSql'; // Import MySQL class

export class API {
    private host : string;
    private user : string;
    private password : string;
    private database : string;
    private datatable : string;
    private app: express.Application;
    private mysql: MySQL;

    constructor(
        host : string,
        user : string,
        password : string,
        database : string,
        datatable : string
    ) {
        this.app = express();
        this.mysql = new MySQL(
            host,
            user,
            password,
            database,
            datatable
        );

        this.app.use(express.json());
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Route for getting token info
        this.app.get('/token-info', async (req, res) => {
            try {
                const tokenSymbol = req.query.tokenSymbol as string;
                if (!tokenSymbol) throw new Error("Token symbol is required");

                const source = req.query.source as string | undefined;
                const startTime = req.query.startTime ? Number(req.query.startTime) : undefined;
                const endTime = req.query.endTime ? Number(req.query.endTime) : undefined;

                const result = await this.mysql.getTokenInfo(tokenSymbol, source, startTime, endTime);
                
                res.json(result);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server is running on port ${port}`));
    }
}
