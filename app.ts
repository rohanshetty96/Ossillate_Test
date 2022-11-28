const fetch = require('node-fetch');
const express = require('express');
const { Request, Response } = require('express');
const createHttpsProxyAgent = require('https-proxy-agent');
const json = require('body-parser');
const jsonParser = json;
const { Logger, IPluginMiddleware, IBasicAuth, PluginOptions } = require('@verdaccio/types');
const { https } = require('https');
const { ConfigAudit } = require('./types');
const { exec } = require('node:util');

class AuditPlugin implements IPluginMiddleware<ConfigAudit> {
    private logger: Logger;
    public enabled: boolean;
    constructor(config: ConfigAudit, options: PluginOptions<ConfigAudit>) {
        this.enabled = config.enabled || false;
        this.logger = options.logger;
    }

    register_middlewares(app: express.Application, auth: IBasicAuth<ConfigAudit>, storage: any): void {
        app.use(jsonParser());

        app.get('/-/npm/v1/security/audits', (req: Request, res: Response) => {
            this.logger.info({ req }, 'audit: get request @{req.url}');
            res.status(200).send('Hello World!');
        });
    }

    private async getPackageInfo(packageName: string, packageVersion: string): Promise<any> {
        const url = `https://registry.npmjs.org/${packageName}/${packageVersion}`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.success) {
            const child = exec("python3 main.py")
        }
    }
}

export default AuditPlugin;